/**
 * Weights for the critic and public reception scores (ADR-0011). Each score is a
 * weighted average of three 0..100 signals, so the weights within a score sum to
 * 1. Starting constants — subject to playtesting balance.
 */

/** Critic score = quality + ambition + innovation (weights sum to 1). */
export const CRITIC_QUALITY_WEIGHT = 0.6;
export const CRITIC_AMBITION_WEIGHT = 0.25;
export const CRITIC_INNOVATION_WEIGHT = 0.15;

/** Public score = quality + accessibility + fame appeal (weights sum to 1). */
export const PUBLIC_QUALITY_WEIGHT = 0.35;
export const PUBLIC_ACCESS_WEIGHT = 0.45;
export const PUBLIC_FAME_WEIGHT = 0.2;

/**
 * How a format's own accessibility vs the genre's accessibility combine into the
 * public score (weights sum to 1).
 */
export const ACCESS_FORMAT_WEIGHT = 0.5;
export const ACCESS_GENRE_WEIGHT = 0.5;

/**
 * How a format's ambition vs the budget's ambition combine into the critic score
 * (weights sum to 1).
 */
export const AMBITION_FORMAT_WEIGHT = 0.6;
export const AMBITION_BUDGET_WEIGHT = 0.4;

/**
 * Fan count at which the public "fame appeal" factor saturates to 1 via
 * `log10(1 + fans) / SCALE`. `10^5 = 100000` fans → 1.0.
 */
export const FAME_APPEAL_SCALE = 5;
