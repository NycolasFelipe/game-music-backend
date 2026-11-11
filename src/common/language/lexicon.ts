/**
 * Shared word metadata for the text generators (band names, release titles).
 * Every word carries what agreement needs: gender and plural for nouns, the
 * four inflected forms for adjectives and transitivity for verbs.
 */

/** Languages the generators write in. */
export type TextLanguage = "pt" | "en" | "es";

/** Grammatical gender of a Portuguese or Spanish noun. */
export type Gender = "m" | "f";

/** Grammatical number of a noun phrase. */
export type GrammaticalNumber = "sg" | "pl";

/** A Portuguese or Spanish noun. */
export interface RomanceNoun {
  /** Singular form, title-cased. */
  readonly sg: string;
  /** Plural form, or `null` when the word is never pluralized (mass/unique). */
  readonly pl: string | null;
  /** Fixed grammatical gender. */
  readonly gender: Gender;
  /** Proper name (Éden, Olimpo): hyphenated after a prefix. */
  readonly proper?: boolean;
  /**
   * Person or creature. Spanish marks such direct objects with "a"
   * ("Despertando al Dragón").
   */
  readonly animate?: boolean;
}

/** A Portuguese or Spanish adjective with its four inflected forms. */
export interface RomanceAdjective {
  /** Masculine singular. */
  readonly ms: string;
  /** Feminine singular. */
  readonly fs: string;
  /** Masculine plural. */
  readonly mp: string;
  /** Feminine plural. */
  readonly fp: string;
  /** Sounds natural before the noun ("A Eterna Tempestade"). */
  readonly prenominal?: boolean;
  /** Only works before the noun ("O Último Verão", never "Verão Último"). */
  readonly onlyBefore?: boolean;
}

/** A Portuguese or Spanish gerund with its transitivity. */
export interface RomanceVerb {
  /** Gerund form, title-cased ("Devorando"). */
  readonly gerund: string;
  /**
   * `true` takes a direct object ("Devorando o Abismo"); `false` follows its
   * subject ("Anjos Caindo").
   */
  readonly transitive: boolean;
}

/** An English noun. */
export interface EnglishNoun {
  /** Singular form, title-cased. */
  readonly sg: string;
  /** Plural form, or `null` for mass nouns and proper names. */
  readonly pl: string | null;
  /** Proper name (Valhalla, Eden): never takes an article. */
  readonly proper?: boolean;
}

/** Extra flags accepted by the noun builders. */
export interface NounFlags {
  readonly proper?: boolean;
}

/**
 * Builds a masculine Romance noun. The plural defaults to `sg + "s"`, which is
 * right for words ending in an unaccented vowel; anything else must pass it.
 *
 * @param sg - Singular form.
 * @param pl - Plural form, or `null` when the word is never pluralized.
 * @param flags - Optional flags (proper name).
 * @returns The noun entry.
 */
export function masc(
  sg: string,
  pl: string | null = `${sg}s`,
  flags: NounFlags = {},
): RomanceNoun {
  return { sg, pl, gender: "m", ...flags };
}

/**
 * Builds a feminine Romance noun. Same plural default as {@link masc}.
 *
 * @param sg - Singular form.
 * @param pl - Plural form, or `null` when the word is never pluralized.
 * @param flags - Optional flags (proper name).
 * @returns The noun entry.
 */
export function fem(
  sg: string,
  pl: string | null = `${sg}s`,
  flags: NounFlags = {},
): RomanceNoun {
  return { sg, pl, gender: "f", ...flags };
}

/**
 * Marks a noun as a person or creature.
 *
 * @param noun - The noun entry.
 * @returns The same entry flagged as animate.
 */
export function animate(noun: RomanceNoun): RomanceNoun {
  return { ...noun, animate: true };
}

/**
 * Builds a regular -o/-a adjective ("Solitário", "Solitária", "Solitários",
 * "Solitárias").
 *
 * @param ms - Masculine singular, ending in "o".
 * @param prenominal - Whether it may come before the noun.
 * @returns The adjective entry.
 */
export function adjO(ms: string, prenominal = false): RomanceAdjective {
  const stem = ms.slice(0, -1);
  return { ms, fs: `${stem}a`, mp: `${ms}s`, fp: `${stem}as`, prenominal };
}

/**
 * Builds an adjective with one form per number and none per gender ("Veloz",
 * "Velozes").
 *
 * @param sg - Singular form (both genders).
 * @param pl - Plural form (both genders).
 * @param prenominal - Whether it may come before the noun.
 * @returns The adjective entry.
 */
export function adj2(
  sg: string,
  pl: string,
  prenominal = false,
): RomanceAdjective {
  return { ms: sg, fs: sg, mp: pl, fp: pl, prenominal };
}

/**
 * Builds a fully invariable adjective ("Neon", "Punk", "Cinza").
 *
 * @param form - The single form.
 * @returns The adjective entry.
 */
export function adjInv(form: string): RomanceAdjective {
  return { ms: form, fs: form, mp: form, fp: form, prenominal: false };
}

/**
 * Restricts an adjective to the position before the noun ("Último").
 *
 * @param adjective - The adjective entry.
 * @returns The same entry, prenominal only.
 */
export function onlyBefore(adjective: RomanceAdjective): RomanceAdjective {
  return { ...adjective, prenominal: true, onlyBefore: true };
}
