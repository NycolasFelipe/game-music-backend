import {
  SKILL_MAX,
  type Skills,
  type SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type { BudgetTier } from "@/modules/releases/domain/data/budget-tiers";
import type { ReleaseFormat } from "@/modules/releases/domain/data/release-formats";
import type { SkillWeights } from "@/modules/releases/domain/data/release-genre-profiles";
import {
  mapQualityTier,
  type QualityTier,
} from "@/modules/releases/domain/data/quality-tiers";
import { RELATIONSHIP_LEVEL_MAX } from "@/modules/bands/domain/constants/relationship.constant";
import {
  CHEMISTRY_WEIGHT,
  FOCUS_FACTORS,
  HAPPINESS_QUALITY_WEIGHT,
  PUBLISHING_RATIO,
  ROYALTY_PAYOUT_RATE,
  UPFRONT_FRACTION,
  type ReleaseCredits,
} from "@/modules/releases/domain/constants/release.constant";

/** A member's data as consumed by the release calculator. */
export interface ReleaseMemberInput {
  id: string;
  skills: Skills;
  happiness: number;
}

/** A relationship between two members, as consumed by the calculator. */
export interface ReleaseRelationshipInput {
  memberAId: string;
  memberBId: string;
  /** Relationship level, `RELATIONSHIP_LEVEL_MIN..MAX`. */
  level: number;
}

/** Everything needed to evaluate a work at finalization. */
export interface ReleaseEvaluationInput {
  format: ReleaseFormat;
  budgetTier: BudgetTier;
  genreProfile: SkillWeights;
  credits: ReleaseCredits;
  members: ReleaseMemberInput[];
  currentFans: number;
  /** The band's relationships, for the chemistry of shared aspects (ADR-0014). */
  relationships?: ReleaseRelationshipInput[];
  /**
   * Commercial multiplier for how crowded the band's own release year already is
   * (ADR-0015 §5; default 1 — the first work of the year).
   */
  saturation?: number;
  /** Product of the creation-event choice modifiers (default 1). */
  eventModifier?: number;
  /** Random quality variance factor, e.g. `1 ± QUALITY_VARIANCE` (default 1). */
  variance?: number;
}

/** The intermediate factors that produced the quality (persisted for display). */
export interface ReleaseQualityFactors {
  skillScore: number;
  moodModifier: number;
  budgetBonus: number;
  eventModifier: number;
  variance: number;
  reach: number;
  /** Average focus factor of the credited members (ADR-0014 §1). */
  focus: number;
  /** Average chemistry factor across the shared aspects (ADR-0014 §2). */
  chemistry: number;
  /** Market saturation applied to fans and revenue (ADR-0015 §5). */
  saturation: number;
}

/** The computed outcome of a work. */
export interface ReleaseEvaluation {
  quality: number;
  qualityTier: QualityTier;
  cost: number;
  fansGained: number;
  masterRevenueTotal: number;
  publishingRevenueTotal: number;
  revenueTotal: number;
  upfront: number;
  royaltyTail: number;
  factors: ReleaseQualityFactors;
}

/** Average of the values, or 1 when there is nothing to average. */
function averageOrOne(values: number[]): number {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 1;
}

/** Clamps a number to a range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * How much of themselves a member brings to each part, given how many aspects
 * they took on in the work (ADR-0014 §1).
 *
 * @param aspectCount - Number of aspects the member is credited on.
 * @returns The focus factor in `(0, 1]`.
 */
export function focusFactor(aspectCount: number): number {
  if (aspectCount <= 0) {
    return 0;
  }
  return FOCUS_FACTORS[Math.min(aspectCount, FOCUS_FACTORS.length - 1)];
}

/**
 * Counts, per member, how many aspects they are credited on in a work.
 *
 * @param credits - Aspect → member ids.
 * @returns Member id → number of aspects.
 */
export function creditLoad(credits: ReleaseCredits): Map<string, number> {
  const load = new Map<string, number>();
  for (const memberIds of Object.values(credits)) {
    for (const memberId of new Set(memberIds ?? [])) {
      load.set(memberId, (load.get(memberId) ?? 0) + 1);
    }
  }
  return load;
}

/**
 * Chemistry of the members sharing one aspect (ADR-0014 §2): the average level
 * of the relationships between every co-credited pair. Neutral (1) for a single
 * member, or when the pairs have no known relationship.
 *
 * @param memberIds - The members credited on the aspect.
 * @param relationships - The band's relationships.
 * @returns A multiplier around 1 (±`CHEMISTRY_WEIGHT`).
 */
export function chemistryFactor(
  memberIds: string[],
  relationships: ReleaseRelationshipInput[] = [],
): number {
  const unique = [...new Set(memberIds)];
  if (unique.length < 2) {
    return 1;
  }

  const levels: number[] = [];
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const pair = relationships.find(
        (rel) =>
          (rel.memberAId === unique[i] && rel.memberBId === unique[j]) ||
          (rel.memberAId === unique[j] && rel.memberBId === unique[i]),
      );
      if (pair) {
        levels.push(pair.level);
      }
    }
  }
  if (levels.length === 0) {
    return 1;
  }

  const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
  return 1 + CHEMISTRY_WEIGHT * (average / RELATIONSHIP_LEVEL_MAX);
}

/**
 * Computes the normalized (0..1) skill score of a work: for each aspect, the
 * average skill the assigned members actually deliver — scaled by how spread
 * out each of them is (focus) and by how well they get along when they share the
 * aspect (chemistry) — weighted by the genre profile. Aspects with no assigned
 * member contribute zero (ADR-0008 §3 + ADR-0014).
 *
 * @param credits - Aspect → member ids.
 * @param members - The credited members' data.
 * @param profile - The genre skill weights.
 * @param relationships - The band's relationships (for chemistry).
 * @returns The weighted skill score in `[0, 1]`.
 */
export function computeSkillScore(
  credits: ReleaseCredits,
  members: ReleaseMemberInput[],
  profile: SkillWeights,
  relationships: ReleaseRelationshipInput[] = [],
): number {
  const byId = new Map(members.map((m) => [m.id, m]));
  const load = creditLoad(credits);
  let score = 0;

  for (const aspect of Object.keys(profile) as SkillType[]) {
    const weight = profile[aspect];
    if (weight <= 0) {
      continue;
    }
    const assignedIds = credits[aspect] ?? [];
    const assigned = assignedIds
      .map((id) => byId.get(id))
      .filter((m): m is ReleaseMemberInput => m !== undefined);
    if (assigned.length === 0) {
      continue;
    }
    const avgSkill =
      assigned.reduce(
        (sum, m) => sum + m.skills[aspect] * focusFactor(load.get(m.id) ?? 1),
        0,
      ) / assigned.length;
    const chemistry = chemistryFactor(
      assigned.map((m) => m.id),
      relationships,
    );
    score += (avgSkill / SKILL_MAX) * weight * chemistry;
  }

  return clamp(score, 0, 1);
}

/**
 * Mood modifier from the average happiness of the credited members. Neutral
 * (factor 1) when no one is credited.
 *
 * @param credits - Aspect → member ids.
 * @param members - The credited members' data.
 * @returns A multiplier around 1 (±`HAPPINESS_QUALITY_WEIGHT`).
 */
export function computeMoodModifier(
  credits: ReleaseCredits,
  members: ReleaseMemberInput[],
): number {
  const creditedIds = new Set(Object.values(credits).flat());
  const credited = members.filter((m) => creditedIds.has(m.id));
  if (credited.length === 0) {
    return 1;
  }
  const avgHappiness =
    credited.reduce((sum, m) => sum + m.happiness, 0) / credited.length;
  return 1 + (avgHappiness / 5) * HAPPINESS_QUALITY_WEIGHT;
}

/**
 * Reach amplification from the band's current fan base: bigger bands turn a
 * release into more fans and money.
 *
 * @param currentFans - The band's current fan count.
 * @returns A multiplier `>= 1`.
 */
export function reachFactor(currentFans: number): number {
  const fans = Math.max(0, Number.isFinite(currentFans) ? currentFans : 0);
  return 1 + Math.log10(1 + fans) * 0.4;
}

/**
 * Evaluates a work end to end: quality, tier, cost, fans, the two revenue
 * tracks, and the upfront/tail split. Pure — randomness enters only via
 * `input.variance`, supplied by the caller.
 *
 * @param input - The format, budget, genre profile, credits, members and state.
 * @returns The computed evaluation.
 */
export function evaluateRelease(
  input: ReleaseEvaluationInput,
): ReleaseEvaluation {
  const eventModifier = input.eventModifier ?? 1;
  const variance = input.variance ?? 1;
  const saturation = clamp(input.saturation ?? 1, 0, 1);

  const skillScore = computeSkillScore(
    input.credits,
    input.members,
    input.genreProfile,
    input.relationships,
  );
  const moodMod = computeMoodModifier(input.credits, input.members);
  const load = creditLoad(input.credits);
  const focus = averageOrOne(
    [...load.values()].map((count) => focusFactor(count)),
  );
  const chemistry = averageOrOne(
    Object.values(input.credits)
      .filter((ids) => (ids?.length ?? 0) > 1)
      .map((ids) => chemistryFactor(ids ?? [], input.relationships)),
  );
  const budgetBonus = input.budgetTier.qualityMultiplier;

  const quality =
    clamp(skillScore * moodMod * budgetBonus * eventModifier * variance, 0, 1) *
    100;
  const qualityTier = mapQualityTier(quality);

  const cost = round2(input.format.baseCost * input.budgetTier.costMultiplier);
  const reach = reachFactor(input.currentFans);

  // Saturation hits the commercial result only: the work is as good as it is,
  // what runs out is the market's appetite for it (ADR-0015 §5).
  const fansGained = Math.round(
    input.format.baseReach * qualityTier.fansMultiplier * reach * saturation,
  );

  const masterRevenueTotal = round2(
    input.format.baseRevenue *
      qualityTier.revenueMultiplier *
      reach *
      saturation,
  );
  const publishingRevenueTotal = round2(masterRevenueTotal * PUBLISHING_RATIO);
  const revenueTotal = round2(masterRevenueTotal + publishingRevenueTotal);

  const upfront = round2(revenueTotal * UPFRONT_FRACTION);
  const royaltyTail = round2(revenueTotal - upfront);

  return {
    quality: round1(quality),
    qualityTier,
    cost,
    fansGained,
    masterRevenueTotal,
    publishingRevenueTotal,
    revenueTotal,
    upfront,
    royaltyTail,
    factors: {
      skillScore: round2(skillScore),
      moodModifier: round2(moodMod),
      budgetBonus,
      eventModifier,
      variance: round2(variance),
      reach: round2(reach),
      focus: round2(focus),
      chemistry: round2(chemistry),
      saturation: round2(saturation),
    },
  };
}

/**
 * The royalty amount paid out for one turn from a remaining tail (geometric
 * decay). The final turn (or a negligible remainder) pays the whole rest.
 *
 * @param remaining - The remaining royalty tail.
 * @param turnsLeft - Turns remaining in the royalty window.
 * @returns The amount to credit this turn (never exceeds `remaining`).
 */
export function royaltyPayout(remaining: number, turnsLeft: number): number {
  if (remaining <= 0 || turnsLeft <= 0) {
    return 0;
  }
  if (turnsLeft === 1) {
    return round2(remaining);
  }
  const payout = remaining * ROYALTY_PAYOUT_RATE;
  return round2(Math.min(payout, remaining));
}

/** Rounds to 1 decimal place. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Rounds to 2 decimal places (currency). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
