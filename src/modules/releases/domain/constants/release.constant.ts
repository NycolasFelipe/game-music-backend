import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";

/**
 * Domain constants for musical works (releases). Economy parameters start as
 * versioned constants and are subject to playtesting balance (ADR-0008).
 */

/** Lifecycle status of a release. */
export const RELEASE_STATUSES = ["em_criacao", "lancada"] as const;

/** A release status: a draft being created, or a launched work. */
export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

/**
 * Credits: a map of aspect (one of the six skills) to the ids of the member(s)
 * assigned to it. An aspect may have several members; a member may hold several
 * aspects. Aspects left unassigned score zero in the quality calculation.
 */
export type ReleaseCredits = Partial<Record<SkillType, string[]>>;

/**
 * Flattens a credits map to the distinct member ids it references.
 *
 * @param credits - The credits map.
 * @returns The credited member ids (strings only).
 */
export function creditedMemberIds(credits: ReleaseCredits): string[] {
  return Object.values(credits)
    .flat()
    .filter((id): id is string => typeof id === "string");
}

/** One entry in a release's creation log (a resolved creation event). */
export interface ReleaseCreationLogEntry {
  eventId: string;
  prompt: string;
  choiceLabel: string;
  qualityModifier: number;
}

/** The quality breakdown persisted with a finalized release (for display). */
export interface ReleaseDetails {
  skillScore: number;
  moodModifier: number;
  budgetBonus: number;
  eventModifier: number;
  variance: number;
  reach: number;
}

/** Fraction of total revenue paid upfront at launch (the rest is a royalty tail). */
export const UPFRONT_FRACTION = 0.4;

/** Fraction of the remaining royalty tail paid out each turn (geometric decay). */
export const ROYALTY_PAYOUT_RATE = 0.5;

/** Maximum number of turns a release keeps paying royalties. */
export const ROYALTY_WINDOW_TURNS = 6;

/** Publishing (composition) revenue as a fraction of master (recording) revenue. */
export const PUBLISHING_RATIO = 0.25;

/** Half-width of the random quality variance applied at evaluation (±8%). */
export const QUALITY_VARIANCE = 0.08;

/** How strongly average member happiness shifts quality (±15% at the extremes). */
export const HAPPINESS_QUALITY_WEIGHT = 0.15;
