/**
 * Shape of the band-name word banks. The word metadata (gender, plural,
 * inflected forms) comes from `@/common/language/lexicon`; the banks
 * themselves live in `@/modules/bands/domain/data/`.
 */
import type {
  EnglishNoun,
  RomanceAdjective,
  RomanceNoun,
  RomanceVerb,
  TextLanguage,
} from "@/common/language/lexicon";

/** Supported name languages. */
export type NameLanguage = TextLanguage;

/** Supported genre hints. */
export type NameGenre = "rock" | "metal" | "electronic" | "punk";

/** Genre-specific Portuguese or Spanish words. */
export interface RomanceGenreWords {
  readonly nouns: readonly RomanceNoun[];
  readonly adjectives: readonly RomanceAdjective[];
}

/** Complete word bank for a Romance language (pt, es). */
export interface RomanceLexicon {
  /** Heads of most names: creatures, people, buildings, sky objects. */
  readonly nouns: readonly RomanceNoun[];
  readonly adjectives: readonly RomanceAdjective[];
  readonly colors: readonly RomanceAdjective[];
  readonly verbs: readonly RomanceVerb[];
  /** Complements of "Conceito + de + Lugar". */
  readonly places: readonly RomanceNoun[];
  /** Abstract heads of "Conceito + de + Lugar"; always singular. */
  readonly concepts: readonly RomanceNoun[];
  /** Bound prefixes ("Neo", "Pós"), title-cased. */
  readonly prefixes: readonly string[];
  readonly genres: Readonly<Record<NameGenre, RomanceGenreWords>>;
}

/** Genre-specific English words. */
export interface EnglishGenreWords {
  /** Words used attributively before a noun ("Steel Dragon"). */
  readonly modifiers: readonly string[];
  /** Words used as the head noun ("Wolves of Steel"). */
  readonly nouns: readonly EnglishNoun[];
}

/** Complete English word bank. */
export interface EnglishLexicon {
  readonly nouns: readonly EnglishNoun[];
  readonly adjectives: readonly string[];
  readonly colors: readonly string[];
  /** Present participles used attributively ("Roaring Wolf"). */
  readonly participles: readonly string[];
  readonly places: readonly EnglishNoun[];
  /** Abstract mass nouns, used without article ("Freedom of the Desert"). */
  readonly concepts: readonly string[];
  readonly prefixes: readonly string[];
  readonly genres: Readonly<Record<NameGenre, EnglishGenreWords>>;
}
