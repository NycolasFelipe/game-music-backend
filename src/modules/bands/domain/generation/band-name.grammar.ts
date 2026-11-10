/**
 * Grammar helpers for the band-name generator: articles, preposition +
 * article contractions, prefix orthography and the English "a/an" choice.
 * Pure functions with no randomness, so each rule can be tested on its own.
 */
import type {
  Gender,
  GrammaticalNumber,
} from "@/modules/bands/domain/generation/band-name.lexicon";

/** Romance languages handled by the agreement rules. */
export type RomanceLanguage = "pt" | "es";

/** Definite ("o", "el") or indefinite ("um", "un") article. */
export type ArticleKind = "definite" | "indefinite";

type ArticleTable = Record<
  ArticleKind,
  Record<Gender, Record<GrammaticalNumber, string>>
>;

const ARTICLES: Record<RomanceLanguage, ArticleTable> = {
  pt: {
    definite: { m: { sg: "o", pl: "os" }, f: { sg: "a", pl: "as" } },
    indefinite: { m: { sg: "um", pl: "uns" }, f: { sg: "uma", pl: "umas" } },
  },
  es: {
    definite: { m: { sg: "el", pl: "los" }, f: { sg: "la", pl: "las" } },
    indefinite: { m: { sg: "un", pl: "unos" }, f: { sg: "una", pl: "unas" } },
  },
};

/**
 * Portuguese prepositions that fuse with the definite article
 * (de + o = do, em + a = na, por + os = pelos).
 */
const PT_CONTRACTIONS: Record<
  string,
  Record<Gender, Record<GrammaticalNumber, string>>
> = {
  de: { m: { sg: "do", pl: "dos" }, f: { sg: "da", pl: "das" } },
  em: { m: { sg: "no", pl: "nos" }, f: { sg: "na", pl: "nas" } },
  por: { m: { sg: "pelo", pl: "pelos" }, f: { sg: "pela", pl: "pelas" } },
};

/** Portuguese prefixes that always take a hyphen (Acordo Ortográfico, 2009). */
const PT_HYPHEN_PREFIXES = new Set([
  "ex",
  "vice",
  "pós",
  "pré",
  "pró",
  "além",
  "aquém",
  "recém",
  "sem",
]);

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/**
 * Removes diacritics from a string ("É" becomes "E").
 *
 * @param text - Any text.
 * @returns The text without combining accent marks.
 */
function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Upper-cases the first character of a string.
 *
 * @param text - Any text.
 * @returns The text with its first character in upper case.
 */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Lower-cases the first character of a string.
 *
 * @param text - Any text.
 * @returns The text with its first character in lower case.
 */
function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Returns the article that agrees with a noun ("os" for masculine plural in
 * Portuguese, "la" for feminine singular in Spanish), in lower case.
 *
 * @param language - "pt" or "es".
 * @param kind - Definite or indefinite.
 * @param gender - Gender of the noun.
 * @param number - Number of the noun phrase.
 * @returns The lower-case article.
 */
export function romanceArticle(
  language: RomanceLanguage,
  kind: ArticleKind,
  gender: Gender,
  number: GrammaticalNumber,
): string {
  return ARTICLES[language][kind][gender][number];
}

/**
 * Joins a preposition with the definite article of the next noun, applying
 * the mandatory contractions: Portuguese "de/em/por" ("do", "nas", "pelos")
 * and Spanish "de/a + el" ("del", "más allá del", "al"). Other prepositions
 * keep the article separate ("sem o", "con la").
 *
 * @param language - "pt" or "es".
 * @param preposition - Lower-case preposition ("de", "em", "más allá de").
 * @param gender - Gender of the following noun.
 * @param number - Number of the following noun.
 * @returns The preposition and article, contracted when required.
 */
export function prepositionWithArticle(
  language: RomanceLanguage,
  preposition: string,
  gender: Gender,
  number: GrammaticalNumber,
): string {
  if (language === "pt") {
    const contracted = PT_CONTRACTIONS[preposition]?.[gender][number];
    if (contracted) {
      return contracted;
    }
  }
  const article = romanceArticle(language, "definite", gender, number);
  if (language === "es" && article === "el") {
    if (preposition === "de" || preposition.endsWith(" de")) {
      return `${preposition.slice(0, -2)}del`;
    }
    if (preposition === "a") {
      return "al";
    }
  }
  return `${preposition} ${article}`;
}

/**
 * Attaches a prefix to a Portuguese noun following the 2009 orthographic
 * agreement: hyphen for prefixes that always take one (ex-, vice-, pós-…),
 * before "h", before the same letter the prefix ends with ("Micro-Ondas",
 * "Hiper-Realidade"), after "sub" before "b/r", after "pan" before a vowel,
 * "m" or "n", and before proper names. Otherwise the words fuse in lower case,
 * doubling "r"/"s" after a vowel ("Antirrei", "Ultrassamurai").
 *
 * @param prefix - Title-cased prefix ("Neo", "Pós").
 * @param word - Title-cased single-word noun form.
 * @param proper - Whether the noun is a proper name.
 * @returns The prefixed word ("Neodragão", "Pós-Apocalipse").
 */
export function joinPrefixPt(
  prefix: string,
  word: string,
  proper = false,
): string {
  const p = prefix.toLowerCase();
  const first = stripAccents(word.charAt(0).toLowerCase());
  const last = stripAccents(p.charAt(p.length - 1));
  const hyphen =
    proper ||
    PT_HYPHEN_PREFIXES.has(p) ||
    first === "h" ||
    first === last ||
    (p === "sub" && (first === "b" || first === "r")) ||
    (p === "pan" && (VOWELS.has(first) || first === "m" || first === "n"));
  if (hyphen) {
    return `${prefix}-${word}`;
  }
  if (VOWELS.has(last) && (first === "r" || first === "s")) {
    return `${prefix}${first}${lowerFirst(word)}`;
  }
  return `${prefix}${lowerFirst(word)}`;
}

/**
 * Attaches a prefix to a Spanish noun following the RAE rules: the prefix
 * fuses with a single word ("Superdragón", "Exvillano"), "r" doubles after a
 * vowel ("Antirrey") and a proper name takes a hyphen ("Anti-Edén").
 *
 * @param prefix - Title-cased prefix ("Neo", "Pos").
 * @param word - Title-cased single-word noun form.
 * @param proper - Whether the noun is a proper name.
 * @returns The prefixed word.
 */
export function joinPrefixEs(
  prefix: string,
  word: string,
  proper = false,
): string {
  if (proper) {
    return `${prefix}-${word}`;
  }
  const first = word.charAt(0).toLowerCase();
  const last = stripAccents(prefix.charAt(prefix.length - 1).toLowerCase());
  if (VOWELS.has(last) && first === "r") {
    return `${prefix}r${lowerFirst(word)}`;
  }
  return `${prefix}${lowerFirst(word)}`;
}

/**
 * Attaches a prefix to an English noun with a hyphen, keeping the title case
 * of both parts ("Anti-Hero", "Neo-Wolves").
 *
 * @param prefix - Title-cased prefix.
 * @param word - Title-cased noun form.
 * @returns The hyphenated word.
 */
export function joinPrefixEn(prefix: string, word: string): string {
  return `${prefix}-${word}`;
}

/**
 * Chooses the English indefinite article by the sound of the next word:
 * "an" before a vowel sound ("an Eternal", "an Ultra-Wolf", "an Hour") and
 * "a" before a consonant sound, including vowels read as "you"/"wuh"
 * ("a Utopian", "a Unicorn", "a One").
 *
 * @param nextWord - The word right after the article.
 * @returns "a" or "an".
 */
export function englishIndefiniteArticle(nextWord: string): "a" | "an" {
  const word = nextWord.toLowerCase();
  if (/^(hour|honest|honou?r|heir)/.test(word)) {
    return "an";
  }
  if (/^(uni|use|usu|uti|uto|ura|ure|uri|eu|ewe|one)/.test(word)) {
    return "a";
  }
  return VOWELS.has(word.charAt(0)) ? "an" : "a";
}
