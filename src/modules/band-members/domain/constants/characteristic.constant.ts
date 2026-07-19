/**
 * Category of a characteristic (trait), used to group traits into generation
 * "slots" and for UX.
 */
export type CharacteristicCategory =
  | "personality"
  | "professionalism"
  | "fame"
  | "creative"
  | "social"
  | "situational";

/** Rarity of a trait during generation. */
export type CharacteristicRarity = "common" | "uncommon" | "rare";

/**
 * A characteristic (personality trait) of a band member.
 */
export interface Characteristic {
  /** Stable id used in code/data (e.g. "creative"). */
  id: string;
  /** Display name (e.g. "Criativo"). */
  name: string;
  /** Flavor description. */
  description: string;
  /** Category for grouping/generation. */
  category: CharacteristicCategory;
  /** Ids of opposite/incompatible traits. */
  opposites: string[];
  /** Generation rarity. */
  rarity: CharacteristicRarity;
}
