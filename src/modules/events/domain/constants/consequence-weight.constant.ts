/**
 * How strongly an event's consequence moves the band's climate (ADR-0032 §1).
 * The templates keep their numbers; these factors scale them on resolution.
 */

/**
 * Happiness points per 100% of `happinessChangePercent`: "−8%" moves the
 * involved members by −1.2 on the −5..5 scale.
 */
export const EVENT_HAPPINESS_POINTS_PER_100_PERCENT = 15;

/** Multiplier on every relationship change an event applies. */
export const EVENT_RELATIONSHIP_MULTIPLIER = 2;
