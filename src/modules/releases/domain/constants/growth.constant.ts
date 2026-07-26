/**
 * Parameters for how a work develops the members credited on it (ADR-0012).
 * Starting constants — subject to playtesting balance.
 */

/**
 * Base skill gain per credited aspect, before the quality, format and headroom
 * factors. At full headroom (skill 0), an average work on a mid-size format.
 */
export const SKILL_GAIN_BASE = 0.5;

/**
 * Floor and span of the quality factor: `FLOOR + SPAN × (quality / 100)`, so a
 * flop still teaches something (0.4×) and a masterpiece teaches much more (1.6×).
 */
export const SKILL_GAIN_QUALITY_FLOOR = 0.4;
export const SKILL_GAIN_QUALITY_SPAN = 1.2;

/**
 * Quality at which a work leaves the credited members indifferent. Above it the
 * work is a source of pride; below it, of frustration.
 */
export const PRIDE_NEUTRAL_QUALITY = 50;

/** Happiness a work adds (or removes) at the extremes of quality. */
export const PRIDE_HAPPINESS_MAX = 0.5;
