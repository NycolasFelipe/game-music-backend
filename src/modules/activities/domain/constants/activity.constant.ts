/**
 * Tuning constants for band activities (ADR-0017). Balancing guesses, versioned
 * as data so they can be tuned without touching the rules.
 */

/**
 * Effect multiplier by how many activities the band already held this turn
 * (ADR-0017 §2). The cost is never reduced — that is the brake.
 */
export const ACTIVITY_SATURATION_FACTORS = [1, 0.5, 0.25, 0.1];

/** How much each fame level raises an activity's cost (expensive taste). */
export const ACTIVITY_FAME_COST_STEP = 0.06;

/**
 * How much each point of hostility in the guest list adds to the chance of the
 * activity going wrong (ADR-0017 §3).
 */
export const ACTIVITY_HOSTILITY_RISK = 0.06;

/** Upper bound for the chance of an activity going wrong. */
export const ACTIVITY_TROUBLE_CHANCE_MAX = 0.8;
