/**
 * What a member looks like in the portraits (ADR-0023). Skin tone and hair
 * colour/curl come from the `avatar` emoji; everything else lives here so the
 * look is stable and owned by the backend.
 */

/** Hair styles a portrait can draw. */
export const HAIR_STYLES = [
  "short",
  "quiff",
  "long",
  "buzz",
  "bald",
  "curly",
  "afro",
  "bob",
  "bun",
  "curlylong",
] as const;
export type HairStyle = (typeof HAIR_STYLES)[number];

/** Facial hair (only drawn on male members). */
export const BEARDS = ["none", "stubble", "full", "goatee"] as const;
export type Beard = (typeof BEARDS)[number];

/** Glasses. */
export const GLASSES = ["none", "round", "sun"] as const;
export type Glasses = (typeof GLASSES)[number];

/** Shirt cut. */
export const SHIRTS = ["crew", "v", "jacket"] as const;
export type Shirt = (typeof SHIRTS)[number];

/** Shirt darkness on the halftone scale (4 = light grey … 10 = solid ink). */
export const SHIRT_TONES = [4, 6, 8, 10] as const;
export type ShirtTone = (typeof SHIRT_TONES)[number];

/** A member's stored look (ADR-0023). */
export interface MemberAppearance {
  hairStyle: HairStyle;
  beard: Beard;
  glasses: Glasses;
  earring: boolean;
  shirt: Shirt;
  shirtTone: ShirtTone;
}

/** Emoji marker of a bald avatar. */
export const AVATAR_BALD = "\u{1F9B2}";
/** Emoji marker of curly hair. */
export const AVATAR_CURLY = "\u{1F9B1}";

/** Age assumed when regenerating an avatar without one (ADR-0023). */
export const DEFAULT_APPEARANCE_AGE = 24;

/** Minimum age for a beard. */
export const BEARD_MIN_AGE = 19;
/** Chance an adult male member has a beard. */
export const BEARD_CHANCE = 0.45;
/** Chance of sunglasses. */
export const SUNGLASSES_CHANCE = 0.12;
/** Chance of round glasses (on top of the sunglasses band). */
export const ROUND_GLASSES_CHANCE = 0.15;
/** Chance of an earring, by gender. */
export const EARRING_CHANCE = { female: 0.55, male: 0.15 } as const;
