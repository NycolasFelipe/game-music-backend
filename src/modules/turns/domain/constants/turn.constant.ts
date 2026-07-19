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
 * Probability (0..1) that advancing a turn spawns a blocking active (decision)
 * event, mirroring the frontend's 35% roll.
 */
export const ACTIVE_EVENT_CHANCE = 0.35;
