/**
 * Turn / time-advancement rules, ported from the `game-music` frontend
 * (read-only reference).
 */

/**
 * How much the live year advances per turn: half a year (one semester). A `.5`
 * fractional year therefore denotes the second semester of a calendar year.
 */
export const TURN_STEP = 0.5;

/**
 * Scene news (passive events) generated per turn (ADR-0024). Three per
 * semester give the newspaper on the turn tab a lead and a few briefs for the
 * current year.
 */
export const PASSIVE_EVENTS_PER_TURN = 3;

/**
 * Probability (0..1) that advancing a turn spawns a blocking active (decision)
 * event. Every semester has one (ADR-0031 §1); the semester goes without only
 * when the band has seen every eligible template.
 */
export const ACTIVE_EVENT_CHANCE = 1;
