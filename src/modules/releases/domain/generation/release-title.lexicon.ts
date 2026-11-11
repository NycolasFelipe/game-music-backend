/**
 * Shape of the release-title word banks. The word metadata (gender, plural,
 * inflected forms) comes from `@/common/language/lexicon`; the banks live in
 * `@/modules/releases/domain/data/release-title-words.ts`.
 */
import type {
  EnglishNoun,
  RomanceAdjective,
  RomanceNoun,
  TextLanguage,
} from "@/common/language/lexicon";

/** Supported title languages. */
export type TitleLanguage = TextLanguage;

/** Title words of a Romance language (pt, es). */
export interface RomanceTitleWords {
  readonly adjectives: readonly RomanceAdjective[];
  /** Concrete images ("Fogo", "Espelho"). */
  readonly nouns: readonly RomanceNoun[];
  /** States and feelings ("Saudade", "Colapso"). */
  readonly abstracts: readonly RomanceNoun[];
}

/** English title words. */
export interface EnglishTitleWords {
  readonly adjectives: readonly string[];
  readonly nouns: readonly EnglishNoun[];
  /** Abstract mass nouns, used without article ("Longing"). */
  readonly abstracts: readonly string[];
}
