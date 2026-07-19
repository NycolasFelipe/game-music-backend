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
 * A band member's skill set. Each value is an integer in the range 0..10
 * (initial generation caps at 3).
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
