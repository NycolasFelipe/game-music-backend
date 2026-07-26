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
  PRIDE_HAPPINESS_MAX,
  PRIDE_NEUTRAL_QUALITY,
  SKILL_GAIN_BASE,
  SKILL_GAIN_QUALITY_FLOOR,
  SKILL_GAIN_QUALITY_SPAN,
} from "@/modules/releases/domain/constants/growth.constant";
import type {
  ReleaseCredits,
  ReleaseMemberGrowth,
  ReleaseSkillGain,
} from "@/modules/releases/domain/constants/release.constant";

/**
 * Member development from finishing a work (ADR-0012) — pure functions. Credited
 * members grow in the aspects they covered, with diminishing returns near the
 * skill cap and scaled by the work's quality and format. No randomness (the
 * variance already entered `quality`).
 */

/** A member's data as consumed by the growth calculator. */
export interface GrowthMemberInput {
  id: string;
  name: string;
  skills: Skills;
  happiness: number;
}

/** Everything the growth computation needs. */
export interface GrowthEvaluationInput {
  /** Aspect → credited member ids. */
  credits: ReleaseCredits;
  /** The band's current members (only these can grow). */
  members: GrowthMemberInput[];
  /** The work's technical quality (0..100). */
  quality: number;
  /** The format's learning weight (`ReleaseFormat.skillGain`). */
  formatWeight: number;
}

/** The absolute new state of one member after the work. */
export interface MemberGrowthOutcome {
  memberId: string;
  /** New absolute skills (to persist). */
  skills: Skills;
  /** New absolute happiness, clamped (to persist). */
  happiness: number;
  /** The display/history record of what the work developed. */
  record: ReleaseMemberGrowth;
}

/** Clamps a value to `[min, max]`. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds to two decimal places (the precision skills/happiness are kept at). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * The quality factor applied to every skill gain (ADR-0012 §1): continuous over
 * quality, so a masterpiece teaches roughly four times what a flop does.
 *
 * @param quality - The work's technical quality (0..100).
 * @returns The multiplier in `[SKILL_GAIN_QUALITY_FLOOR, FLOOR + SPAN]`.
 */
export function qualityLearningFactor(quality: number): number {
  const value = clamp(Number.isFinite(quality) ? quality : 0, 0, 100);
  return SKILL_GAIN_QUALITY_FLOOR + SKILL_GAIN_QUALITY_SPAN * (value / 100);
}

/**
 * The skill a member reaches in one aspect after working on the release
 * (ADR-0012 §1). The headroom term makes the gain shrink toward zero as the
 * skill approaches `SKILL_MAX`, so the cap is asymptotic.
 *
 * @param skill - The member's current level in the aspect (0..`SKILL_MAX`).
 * @param quality - The work's technical quality (0..100).
 * @param formatWeight - The format's learning weight.
 * @returns The new level, rounded to two decimals and capped at `SKILL_MAX`.
 */
export function grownSkill(
  skill: number,
  quality: number,
  formatWeight: number,
): number {
  const current = clamp(Number.isFinite(skill) ? skill : 0, 0, SKILL_MAX);
  const headroom = (SKILL_MAX - current) / SKILL_MAX;
  const gain =
    SKILL_GAIN_BASE *
    qualityLearningFactor(quality) *
    Math.max(0, formatWeight) *
    headroom;
  return round2(Math.min(SKILL_MAX, current + gain));
}

/**
 * The happiness a work gives (or takes from) the members credited on it
 * (ADR-0012 §5): pride above `PRIDE_NEUTRAL_QUALITY`, frustration below it.
 *
 * @param quality - The work's technical quality (0..100).
 * @returns The happiness delta, within `±PRIDE_HAPPINESS_MAX`.
 */
export function prideHappinessDelta(quality: number): number {
  const value = clamp(Number.isFinite(quality) ? quality : 0, 0, 100);
  const ratio = clamp((value - PRIDE_NEUTRAL_QUALITY) / 50, -1, 1);
  return round2(ratio * PRIDE_HAPPINESS_MAX);
}

/**
 * Computes how a finished work develops the members credited on it: per member,
 * the new skills for every aspect they covered plus the pride/frustration the
 * result caused. Credits pointing at members who are no longer in the band are
 * ignored (as they already are by the quality calculation).
 *
 * @param input - Credits, current members, quality and the format weight.
 * @returns One outcome per credited member (empty when nobody was credited).
 */
export function evaluateMemberGrowth(
  input: GrowthEvaluationInput,
): MemberGrowthOutcome[] {
  const aspectsByMember = new Map<string, SkillType[]>();

  for (const [aspect, memberIds] of Object.entries(input.credits) as Array<
    [SkillType, string[] | undefined]
  >) {
    for (const memberId of memberIds ?? []) {
      const aspects = aspectsByMember.get(memberId) ?? [];
      if (!aspects.includes(aspect)) {
        aspects.push(aspect);
        aspectsByMember.set(memberId, aspects);
      }
    }
  }

  const happinessDelta = prideHappinessDelta(input.quality);

  return input.members
    .filter((member) => aspectsByMember.has(member.id))
    .map((member) => {
      const skills: Skills = { ...member.skills };
      const gains: ReleaseSkillGain[] = [];

      for (const aspect of aspectsByMember.get(member.id) ?? []) {
        const from = round2(member.skills[aspect]);
        const to = grownSkill(from, input.quality, input.formatWeight);
        if (to <= from) {
          continue; // Already at the cap: nothing left to learn here.
        }
        skills[aspect] = to;
        gains.push({
          skill: aspect,
          from,
          to,
          leveledUp: Math.floor(to) > Math.floor(from),
        });
      }

      return {
        memberId: member.id,
        skills,
        happiness: clamp(
          round2(member.happiness + happinessDelta),
          HAPPINESS_MIN,
          HAPPINESS_MAX,
        ),
        record: {
          memberId: member.id,
          name: member.name,
          happinessDelta,
          gains,
        },
      };
    });
}
