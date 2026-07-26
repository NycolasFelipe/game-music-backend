import {
  HAPPINESS_MAX,
  HAPPINESS_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  SKILL_MAX,
  type Skills,
  type SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import {
  GIG_FAME_WEIGHT,
  GIG_FEE_FLOOR,
  GIG_MOOD_WEIGHT,
  GIG_TRIUMPH_SWING,
  STAGE_SKILL_WEIGHTS,
} from "@/modules/gigs/domain/constants/gig.constant";
import type { GigType } from "@/modules/gigs/domain/data/gig-types";

/**
 * Live-season scoring (ADR-0016 §3-4) — pure functions. What the band takes home
 * comes from how it plays (stage skills × mood) and how many people it draws
 * (fame), never from randomness generated here: the variance is supplied by the
 * caller, as in the release calculator.
 */

/** A member's data as consumed by the gig calculator. */
export interface GigMemberInput {
  id: string;
  skills: Skills;
  happiness: number;
}

/** Everything needed to evaluate a live season. */
export interface GigEvaluationInput {
  gigType: GigType;
  members: GigMemberInput[];
  /** The band's current fan count (its draw). */
  currentFans: number;
  /** Performance variance factor, e.g. `1 ± GIG_VARIANCE` (default 1). */
  variance?: number;
}

/** The computed outcome of a live season. */
export interface GigEvaluation {
  /** How well the band played, `0..1`. */
  performance: number;
  /** Seasonal fee earned. */
  fee: number;
  /** Seasonal cost paid. */
  cost: number;
  /** `fee - cost` — what actually lands in the band's cash. */
  net: number;
  fansGained: number;
  /** Happiness delta applied to every member (wear vs triumph). */
  happinessDelta: number;
  /** New absolute happiness per member, clamped. */
  memberHappiness: Array<{ memberId: string; happiness: number }>;
}

/** Clamps a value to `[min, max]`. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds to two decimals (money/happiness precision). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * The band's stage skill, `0..1`: the weighted average of the skills that go on
 * stage, averaged across the members.
 *
 * @param members - The band's members.
 * @returns The stage skill in `[0, 1]` (0 for an empty band).
 */
export function stageSkill(members: GigMemberInput[]): number {
  if (members.length === 0) {
    return 0;
  }

  const entries = Object.entries(STAGE_SKILL_WEIGHTS) as Array<
    [SkillType, number]
  >;
  const perMember = members.map((member) =>
    entries.reduce(
      (sum, [skill, weight]) =>
        sum + (member.skills[skill] / SKILL_MAX) * weight,
      0,
    ),
  );

  return clamp(
    perMember.reduce((sum, value) => sum + value, 0) / perMember.length,
    0,
    1,
  );
}

/**
 * How much the band's own draw adds to what a season is worth (ADR-0016 §3).
 *
 * @param currentFans - The band's current fan count.
 * @returns A multiplier `>= 1`.
 */
export function drawFactor(currentFans: number): number {
  const fans = Math.max(0, Number.isFinite(currentFans) ? currentFans : 0);
  return 1 + Math.log10(1 + fans) * GIG_FAME_WEIGHT;
}

/**
 * Evaluates a live season end to end: performance, fee, cost, fans and the mood
 * it leaves behind. Pure — randomness enters only via `input.variance`.
 *
 * @param input - The circuit, the band's members, its fan count and the variance.
 * @returns The season's outcome.
 */
export function evaluateGig(input: GigEvaluationInput): GigEvaluation {
  const variance = input.variance ?? 1;

  const avgHappiness =
    input.members.length === 0
      ? 0
      : input.members.reduce((sum, member) => sum + member.happiness, 0) /
        input.members.length;
  const mood = 1 + (avgHappiness / HAPPINESS_MAX) * GIG_MOOD_WEIGHT;

  const performance = clamp(stageSkill(input.members) * mood * variance, 0, 1);
  const draw = drawFactor(input.currentFans);

  const fee = round2(
    input.gigType.baseFee * (GIG_FEE_FLOOR + performance) * draw,
  );
  const cost = input.gigType.cost;
  const net = round2(fee - cost);

  const fansGained = Math.round(
    input.gigType.baseFans *
      performance *
      input.gigType.ownFansMultiplier *
      draw,
  );

  // A dull season wears the band down; a great one pays the wear back.
  const happinessDelta = round2(
    -input.gigType.wear + (performance - 0.5) * GIG_TRIUMPH_SWING,
  );

  return {
    performance: round2(performance),
    fee,
    cost,
    net,
    fansGained,
    happinessDelta,
    memberHappiness: input.members.map((member) => ({
      memberId: member.id,
      happiness: clamp(
        round2(member.happiness + happinessDelta),
        HAPPINESS_MIN,
        HAPPINESS_MAX,
      ),
    })),
  };
}
