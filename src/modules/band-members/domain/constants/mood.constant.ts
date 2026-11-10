/**
 * Mood rules of the turn tick (ADR-0032). Balancing values, kept as data so
 * they can be tuned without touching the rules.
 */

/**
 * Fraction of the distance to neutral (0) a member's happiness loses on every
 * turn advance, after the payroll. Keeps +5 a peak instead of a resting place.
 */
export const MOOD_DRIFT_RATE = 0.05;

/** Happiness at or below which a member counts a turn of bad mood. */
export const MOOD_DEPARTURE_THRESHOLD = -4;

/**
 * Consecutive turn advances ending at or below {@link MOOD_DEPARTURE_THRESHOLD}
 * after which the member leaves the band.
 */
export const MOOD_DEPARTURE_TURNS = 2;

/**
 * Fraction of the fans a band loses for every member who leaves, for any
 * reason (ADR-0032 §5). Several departures in one advance compound.
 */
export const DEPARTURE_FAN_LOSS = 0.1;
