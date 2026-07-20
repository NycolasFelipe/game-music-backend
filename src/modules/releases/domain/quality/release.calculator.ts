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
import {
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

/** Everything needed to evaluate a work at finalization. */
export interface ReleaseEvaluationInput {
  format: ReleaseFormat;
  budgetTier: BudgetTier;
  genreProfile: SkillWeights;
  credits: ReleaseCredits;
  members: ReleaseMemberInput[];
  currentFans: number;
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

/** Clamps a number to a range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes the normalized (0..1) skill score of a work: for each aspect, the
 * average skill of the assigned members, weighted by the genre profile. Aspects
 * with no assigned member contribute zero.
 *
 * @param credits - Aspect → member ids.
 * @param members - The credited members' data.
 * @param profile - The genre skill weights.
 * @returns The weighted skill score in `[0, 1]`.
 */
export function computeSkillScore(
  credits: ReleaseCredits,
  members: ReleaseMemberInput[],
  profile: SkillWeights,
): number {
  const byId = new Map(members.map((m) => [m.id, m]));
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
      assigned.reduce((sum, m) => sum + m.skills[aspect], 0) / assigned.length;
    score += (avgSkill / SKILL_MAX) * weight;
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

  const skillScore = computeSkillScore(
    input.credits,
    input.members,
    input.genreProfile,
  );
  const moodMod = computeMoodModifier(input.credits, input.members);
  const budgetBonus = input.budgetTier.qualityMultiplier;

  const quality =
    clamp(skillScore * moodMod * budgetBonus * eventModifier * variance, 0, 1) *
    100;
  const qualityTier = mapQualityTier(quality);

  const cost = round2(input.format.baseCost * input.budgetTier.costMultiplier);
  const reach = reachFactor(input.currentFans);

  const fansGained = Math.round(
    input.format.baseReach * qualityTier.fansMultiplier * reach,
  );

  const masterRevenueTotal = round2(
    input.format.baseRevenue * qualityTier.revenueMultiplier * reach,
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
