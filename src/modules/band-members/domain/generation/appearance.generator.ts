import {
  AVATAR_BALD,
  AVATAR_CURLY,
  BEARD_CHANCE,
  BEARD_MIN_AGE,
  EARRING_CHANCE,
  ROUND_GLASSES_CHANCE,
  SHIRT_TONES,
  SUNGLASSES_CHANCE,
  type Beard,
  type Glasses,
  type HairStyle,
  type MemberAppearance,
  type Shirt,
} from "@/modules/band-members/domain/constants/appearance.constant";
import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";

/** What a member's look is derived from. */
export interface AppearanceSource {
  gender: Gender;
  age: number;
  /** The member's emoji; its hair marker (bald, curly) constrains the style. */
  avatar: string;
}

/** A random source in `[0, 1)` (injectable for tests). */
export type RandomSource = () => number;

/**
 * Picks one item uniformly.
 *
 * @param items - The items to pick from.
 * @param random - The random source.
 * @returns The picked item.
 */
function pick<T>(items: readonly T[], random: RandomSource): T {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

/**
 * Chooses the hair style the portrait draws, respecting the avatar's hair
 * marker (ADR-0023).
 *
 * @param source - Gender and avatar.
 * @param random - The random source.
 * @returns The hair style.
 */
function hairStyle(source: AppearanceSource, random: RandomSource): HairStyle {
  if (source.avatar.includes(AVATAR_BALD)) {
    return "bald";
  }
  const curly = source.avatar.includes(AVATAR_CURLY);
  if (source.gender === "female") {
    return curly
      ? "curlylong"
      : pick(["long", "long", "bob", "bun", "long"] as const, random);
  }
  if (source.gender === "neutral") {
    return curly
      ? pick(["curly", "afro", "curlylong"] as const, random)
      : pick(["short", "long", "bob", "buzz", "bun"] as const, random);
  }
  return curly
    ? pick(["curly", "afro"] as const, random)
    : pick(["short", "quiff", "long", "buzz", "short"] as const, random);
}

/**
 * Generates a member's stored look (ADR-0023): hair style, beard, glasses,
 * earring, shirt and shirt tone. Pure given the random source.
 *
 * @param source - The member's gender, age and avatar.
 * @param random - Random source in `[0, 1)`; defaults to `Math.random`.
 * @returns The appearance.
 */
export function generateAppearance(
  source: AppearanceSource,
  random: RandomSource = Math.random,
): MemberAppearance {
  const hair = hairStyle(source, random);

  const beard: Beard =
    source.gender === "male" &&
    source.age >= BEARD_MIN_AGE &&
    random() < BEARD_CHANCE
      ? pick(["stubble", "full", "goatee"] as const, random)
      : "none";

  const glassesRoll = random();
  const glasses: Glasses =
    glassesRoll < SUNGLASSES_CHANCE
      ? "sun"
      : glassesRoll < SUNGLASSES_CHANCE + ROUND_GLASSES_CHANCE
        ? "round"
        : "none";

  const earring = random() < EARRING_CHANCE[source.gender];
  const shirt: Shirt = pick(["crew", "v", "jacket", "crew"] as const, random);
  const shirtTone = pick(SHIRT_TONES, random);

  return { hairStyle: hair, beard, glasses, earring, shirt, shirtTone };
}
