/**
 * The six musical skills every band member has. IDs are stable and used as
 * keys in the {@link Skills} object and as the `primarySkill` value.
 */
export const SKILL_TYPES = [
  "vocal",
  "guitar",
  "bass",
  "drums",
  "piano",
  "lyrics",
] as const;

/** A musical skill identifier. */
export type SkillType = (typeof SKILL_TYPES)[number];

/**
 * A band member's skill set. Each value ranges from 0 to 10 (initial generation
 * yields integers capped at 3). Skills grow with published works (ADR-0012), so
 * values may carry up to 2 decimals — clients should round for display.
 */
export interface Skills {
  vocal: number;
  guitar: number;
  bass: number;
  drums: number;
  piano: number;
  lyrics: number;
}

/** Minimum and maximum allowed value for any single skill. */
export const SKILL_MIN = 0;
export const SKILL_MAX = 10;
