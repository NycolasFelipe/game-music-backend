/**
 * Band name generator. Builds names from per-language word banks whose words
 * carry gender and number, so every article, adjective and contraction agrees
 * with its noun ("As Tempestades Elétricas", "O Rei dos Lobos", "La Venganza
 * del Desierto", "An Eternal Storm"). No side effects beyond `Math.random()`.
 */
import { EN_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-en";
import { ES_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-es";
import { PT_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-pt";
import {
  capitalizeFirst,
  englishIndefiniteArticle,
  joinPrefixEn,
  joinPrefixEs,
  joinPrefixPt,
  prepositionWithArticle,
  romanceArticle,
  type RomanceLanguage,
} from "@/modules/bands/domain/generation/band-name.grammar";
import type {
  EnglishNoun,
  GrammaticalNumber,
  NameGenre,
  NameLanguage,
  RomanceAdjective,
  RomanceLexicon,
  RomanceNoun,
} from "@/modules/bands/domain/generation/band-name.lexicon";

export type {
  NameGenre,
  NameLanguage,
} from "@/modules/bands/domain/generation/band-name.lexicon";

/** Options controlling name generation. */
export interface GenerateNameOptions {
  language?: NameLanguage;
  includeArticle?: boolean;
  genre?: NameGenre;
}

const ROMANCE_WORDS: Record<RomanceLanguage, RomanceLexicon> = {
  pt: PT_BAND_NAME_WORDS,
  es: ES_BAND_NAME_WORDS,
};

/**
 * Prepositions linking two nouns, repeated to weight the draw. "de" is the
 * most natural link in both languages, so it appears more often.
 */
const ROMANCE_LINKS: Record<RomanceLanguage, readonly string[]> = {
  pt: ["de", "de", "de", "em", "por", "sem"],
  es: ["de", "de", "de", "en", "con", "sin", "más allá de"],
};

/** Prepositions that read well before a bare noun ("Coração de Dragão"). */
const BARE_LINKS = new Set(["de", "sem", "sin"]);

/** English links between two nouns, weighted towards "of". */
const ENGLISH_LINKS = ["of", "of", "of", "from", "beyond", "within", "and"];

/** Chance of a plural head noun when the noun allows it. */
const PLURAL_CHANCE = 0.4;

/** Chance of a definite article when an article is used. */
const DEFINITE_CHANCE = 0.85;

/** Chance of moving a prenominal adjective before the noun. */
const PRENOMINAL_CHANCE = 0.3;

/**
 * Picks a random element from a non-empty array.
 *
 * @param array - Candidates.
 * @returns One of them, uniformly.
 */
function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Picks a random element whose key differs from every excluded key, so a name
 * never repeats a word ("Abismo do Abismo"). Falls back to the full list if
 * the exclusion empties it.
 *
 * @param array - Candidates.
 * @param key - Extracts the comparable word of a candidate.
 * @param excluded - Words already used in the name.
 * @returns A candidate not yet used.
 */
function pickOther<T>(
  array: readonly T[],
  key: (item: T) => string,
  excluded: readonly string[],
): T {
  const remaining = array.filter((item) => !excluded.includes(key(item)));
  return pick(remaining.length > 0 ? remaining : array);
}

/**
 * Draws `true` with the given probability.
 *
 * @param probability - Value between 0 and 1.
 * @returns Whether the draw succeeded.
 */
function chance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Joins name parts with spaces, skipping empty ones, and capitalizes the
 * first letter (articles inside the name stay lower case).
 *
 * @param parts - Words or phrases in order.
 * @returns The final name.
 */
function compose(...parts: string[]): string {
  return capitalizeFirst(parts.filter((part) => part !== "").join(" "));
}

/**
 * Whether a word is a single token (no space or hyphen), the only kind that
 * takes a prefix.
 *
 * @param word - Singular form.
 * @returns `true` for single-token words.
 */
function isSingleWord(word: string): boolean {
  return !/[\s-]/.test(word);
}

// ---------------------------------------------------------------------------
// Portuguese and Spanish
// ---------------------------------------------------------------------------

/**
 * Draws the number of a Romance noun phrase, respecting nouns without plural.
 *
 * @param noun - Head noun.
 * @param pluralChance - Probability of plural when allowed.
 * @returns "sg" or "pl".
 */
function romanceNumber(
  noun: RomanceNoun,
  pluralChance = PLURAL_CHANCE,
): GrammaticalNumber {
  return noun.pl !== null && chance(pluralChance) ? "pl" : "sg";
}

/**
 * Returns the noun form for a number.
 *
 * @param noun - The noun.
 * @param number - Desired number.
 * @returns Singular or plural form.
 */
function romanceNounForm(noun: RomanceNoun, number: GrammaticalNumber): string {
  return number === "pl" && noun.pl !== null ? noun.pl : noun.sg;
}

/**
 * Returns the adjective form agreeing with a noun.
 *
 * @param adjective - The adjective.
 * @param noun - The noun it modifies.
 * @param number - Number of the noun phrase.
 * @returns The agreeing form ("Elétricas" for a feminine plural).
 */
function romanceAdjectiveForm(
  adjective: RomanceAdjective,
  noun: RomanceNoun,
  number: GrammaticalNumber,
): string {
  if (noun.gender === "m") {
    return number === "sg" ? adjective.ms : adjective.mp;
  }
  return number === "sg" ? adjective.fs : adjective.fp;
}

/**
 * Returns the leading article of a name, or "" when articles are off.
 * Proper names only take the definite article.
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether the caller wants an article.
 * @param noun - Head noun.
 * @param number - Number of the noun phrase.
 * @returns The lower-case article or "".
 */
function romanceLeadingArticle(
  language: RomanceLanguage,
  includeArticle: boolean,
  noun: RomanceNoun,
  number: GrammaticalNumber,
): string {
  if (!includeArticle) {
    return "";
  }
  const kind =
    noun.proper || chance(DEFINITE_CHANCE) ? "definite" : "indefinite";
  return romanceArticle(language, kind, noun.gender, number);
}

/**
 * Builds "noun + adjective" with agreement, moving prenominal adjectives in
 * front of the noun now and then ("A Eterna Tempestade").
 *
 * @param noun - Head noun.
 * @param number - Number of the phrase.
 * @param adjective - Modifier.
 * @returns The agreeing phrase without article.
 */
function romanceNounWithAdjective(
  noun: RomanceNoun,
  number: GrammaticalNumber,
  adjective: RomanceAdjective,
): string {
  const nounForm = romanceNounForm(noun, number);
  const adjectiveForm = romanceAdjectiveForm(adjective, noun, number);
  return adjective.prenominal && chance(PRENOMINAL_CHANCE)
    ? `${adjectiveForm} ${nounForm}`
    : `${nounForm} ${adjectiveForm}`;
}

/**
 * Builds "[article] noun + adjective" ("Os Lobos Solitários").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether to lead with an article.
 * @param nouns - Pool of head nouns.
 * @param adjectives - Pool of adjectives.
 * @returns The name.
 */
function romanceAdjectivePhrase(
  language: RomanceLanguage,
  includeArticle: boolean,
  nouns: readonly RomanceNoun[],
  adjectives: readonly RomanceAdjective[],
): string {
  const noun = pick(nouns);
  const adjective = pickOther(adjectives, (a) => a.ms, [noun.sg]);
  const number = romanceNumber(noun);
  return compose(
    romanceLeadingArticle(language, includeArticle, noun, number),
    romanceNounWithAdjective(noun, number, adjective),
  );
}

/**
 * Builds "[article] noun + preposition + noun" with the right contraction
 * ("O Rei dos Lobos", "Templo na Tempestade", "Coração de Dragão").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether to lead with an article.
 * @returns The name.
 */
function romanceLinkedNouns(
  language: RomanceLanguage,
  includeArticle: boolean,
): string {
  const words = ROMANCE_WORDS[language];
  const head = pick(words.nouns);
  const headNumber = romanceNumber(head);
  const complement = pickOther(words.nouns, (n) => n.sg, [head.sg]);
  const complementNumber = romanceNumber(complement, 0.5);
  const link = pick(ROMANCE_LINKS[language]);
  // Proper names keep their article ("do Olimpo", never "de Olimpo").
  const bare =
    !complement.proper &&
    BARE_LINKS.has(link) &&
    (link !== "de" || chance(0.35));
  const linkPhrase = bare
    ? link
    : prepositionWithArticle(
        language,
        link,
        complement.gender,
        complementNumber,
      );
  return compose(
    romanceLeadingArticle(language, includeArticle, head, headNumber),
    romanceNounForm(head, headNumber),
    linkPhrase,
    romanceNounForm(complement, complementNumber),
  );
}

/**
 * Builds a gerund name. Transitive verbs lead and take an object with
 * article or a bare plural ("Devorando o Abismo", "Devorando Planetas");
 * a Spanish person or creature as object takes the personal "a"
 * ("Despertando al Dragón"). Intransitive verbs follow their subject
 * ("Os Anjos Caindo").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether the subject takes an article.
 * @returns The name.
 */
function romanceGerundPhrase(
  language: RomanceLanguage,
  includeArticle: boolean,
): string {
  const words = ROMANCE_WORDS[language];
  const verb = pick(words.verbs);
  const noun = pick(words.nouns);
  if (verb.transitive) {
    const number = romanceNumber(noun, 0.5);
    const object = romanceNounForm(noun, number);
    if (language === "es" && noun.animate) {
      const marker = prepositionWithArticle(language, "a", noun.gender, number);
      return compose(verb.gerund, marker, object);
    }
    if (number === "pl" && chance(0.4)) {
      return compose(verb.gerund, object);
    }
    const article = romanceArticle(language, "definite", noun.gender, number);
    return compose(verb.gerund, article, object);
  }
  const number = romanceNumber(noun, 0.6);
  return compose(
    romanceLeadingArticle(language, includeArticle, noun, number),
    romanceNounForm(noun, number),
    verb.gerund,
  );
}

/**
 * Builds "[article] concept + de + place" ("A Vingança das Cavernas",
 * "El Caos del Desierto").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether to lead with an article.
 * @returns The name.
 */
function romanceConceptOfPlace(
  language: RomanceLanguage,
  includeArticle: boolean,
): string {
  const words = ROMANCE_WORDS[language];
  const concept = pick(words.concepts);
  const place = pickOther(words.places, (p) => p.sg, [concept.sg]);
  const placeNumber = romanceNumber(place, 0.3);
  const article = includeArticle
    ? romanceArticle(language, "definite", concept.gender, "sg")
    : "";
  return compose(
    article,
    concept.sg,
    prepositionWithArticle(language, "de", place.gender, placeNumber),
    romanceNounForm(place, placeNumber),
  );
}

/**
 * Builds "[article] prefix+noun" with the language's prefix orthography
 * ("Os Neodragões", "O Pós-Éden", "El Superdragón").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether to lead with an article.
 * @returns The name.
 */
function romancePrefixed(
  language: RomanceLanguage,
  includeArticle: boolean,
): string {
  const words = ROMANCE_WORDS[language];
  const noun = pick(words.nouns.filter((n) => isSingleWord(n.sg)));
  const number = romanceNumber(noun);
  const join = language === "pt" ? joinPrefixPt : joinPrefixEs;
  const prefixed = join(
    pick(words.prefixes),
    romanceNounForm(noun, number),
    noun.proper ?? false,
  );
  return compose(
    romanceLeadingArticle(language, includeArticle, noun, number),
    prefixed,
  );
}

/**
 * Builds a name from the genre words: genre noun + adjective ("As Guitarras
 * Distorcidas"), noun + "de" + genre noun ("Lobos de Aço") or noun + genre
 * adjective ("Os Anjos Podres").
 *
 * @param language - "pt" or "es".
 * @param includeArticle - Whether to lead with an article.
 * @param genre - Genre hint.
 * @returns The name.
 */
function romanceGenrePhrase(
  language: RomanceLanguage,
  includeArticle: boolean,
  genre: NameGenre,
): string {
  const words = ROMANCE_WORDS[language];
  const genreWords = words.genres[genre];
  const variant = pick(["genreNoun", "ofGenreNoun", "genreAdjective"]);
  if (variant === "genreNoun") {
    return romanceAdjectivePhrase(language, includeArticle, genreWords.nouns, [
      ...words.adjectives,
      ...genreWords.adjectives,
    ]);
  }
  if (variant === "genreAdjective") {
    return romanceAdjectivePhrase(
      language,
      includeArticle,
      words.nouns,
      genreWords.adjectives,
    );
  }
  const head = pick(words.nouns);
  const headNumber = romanceNumber(head);
  const material = pickOther(genreWords.nouns, (n) => n.sg, [head.sg]);
  return compose(
    romanceLeadingArticle(language, includeArticle, head, headNumber),
    romanceNounForm(head, headNumber),
    "de",
    romanceNounForm(material, romanceNumber(material)),
  );
}

type RomancePattern = (
  language: RomanceLanguage,
  includeArticle: boolean,
  genre?: NameGenre,
) => string;

const ROMANCE_PATTERNS: readonly RomancePattern[] = [
  (language, includeArticle) =>
    romanceAdjectivePhrase(
      language,
      includeArticle,
      ROMANCE_WORDS[language].nouns,
      ROMANCE_WORDS[language].adjectives,
    ),
  romanceLinkedNouns,
  romanceGerundPhrase,
  romanceConceptOfPlace,
  romancePrefixed,
  (language, includeArticle) =>
    romanceAdjectivePhrase(
      language,
      includeArticle,
      ROMANCE_WORDS[language].nouns,
      ROMANCE_WORDS[language].colors,
    ),
  (language, includeArticle, genre) =>
    genre
      ? romanceGenrePhrase(language, includeArticle, genre)
      : ROMANCE_PATTERNS[0](language, includeArticle),
];

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

/**
 * Draws the number of an English noun phrase.
 *
 * @param noun - Head noun.
 * @param pluralChance - Probability of plural when the noun has one.
 * @returns "sg" or "pl".
 */
function englishNumber(
  noun: EnglishNoun,
  pluralChance = PLURAL_CHANCE,
): GrammaticalNumber {
  return noun.pl !== null && chance(pluralChance) ? "pl" : "sg";
}

/**
 * Returns the noun form for a number.
 *
 * @param noun - The noun.
 * @param number - Desired number.
 * @returns Singular or plural form.
 */
function englishNounForm(noun: EnglishNoun, number: GrammaticalNumber): string {
  return number === "pl" && noun.pl !== null ? noun.pl : noun.sg;
}

/**
 * Returns the leading article of an English name: "The" or "Some" before a
 * plural, "The" or "A/An" (by sound) before a countable singular, "The" before
 * a mass noun and nothing before a proper name.
 *
 * @param includeArticle - Whether the caller wants an article.
 * @param noun - Head noun.
 * @param number - Number of the phrase.
 * @param nextWord - First word after the article.
 * @returns The lower-case article or "".
 */
function englishLeadingArticle(
  includeArticle: boolean,
  noun: EnglishNoun,
  number: GrammaticalNumber,
  nextWord: string,
): string {
  if (!includeArticle || noun.proper) {
    return "";
  }
  if (chance(DEFINITE_CHANCE)) {
    return "the";
  }
  if (number === "pl") {
    return "some";
  }
  return noun.pl === null ? "the" : englishIndefiniteArticle(nextWord);
}

/**
 * Builds "[article] modifier + noun", the common English shape ("The Eternal
 * Storms", "Black Wolf", "Roaring Thunder").
 *
 * @param includeArticle - Whether to lead with an article.
 * @param modifier - Attributive word.
 * @param noun - Head noun.
 * @returns The name.
 */
function englishModifiedNoun(
  includeArticle: boolean,
  modifier: string,
  noun: EnglishNoun,
): string {
  const number = englishNumber(noun);
  return compose(
    englishLeadingArticle(includeArticle, noun, number, modifier),
    modifier,
    englishNounForm(noun, number),
  );
}

/**
 * Returns the complement after an English preposition: a proper name or mass
 * noun alone ("of Valhalla", "of Thunder"), or a countable noun with "the" or
 * in the plural ("of the Storm", "of Wolves"). A bare countable singular
 * ("of Wolf") never appears.
 *
 * @param noun - The complement noun.
 * @returns The complement phrase.
 */
function englishComplement(noun: EnglishNoun): string {
  if (noun.pl === null) {
    return noun.sg;
  }
  if (chance(0.5)) {
    return noun.pl;
  }
  return `the ${englishNounForm(noun, englishNumber(noun, 0.3))}`;
}

/**
 * Builds "[article] noun + link + complement" ("The Heart of the Storm",
 * "Wolves beyond Valhalla").
 *
 * @param includeArticle - Whether to lead with an article.
 * @returns The name.
 */
function englishLinkedNouns(includeArticle: boolean): string {
  const words = EN_BAND_NAME_WORDS;
  const head = pick(words.nouns);
  const number = englishNumber(head);
  const headForm = englishNounForm(head, number);
  const complement = pickOther(words.nouns, (n) => n.sg, [head.sg]);
  return compose(
    englishLeadingArticle(includeArticle, head, number, headForm),
    headForm,
    pick(ENGLISH_LINKS),
    englishComplement(complement),
  );
}

/**
 * Builds "[The] concept of the place" ("Freedom of the Graveyard").
 *
 * @param includeArticle - Whether to lead with "The".
 * @returns The name.
 */
function englishConceptOfPlace(includeArticle: boolean): string {
  const words = EN_BAND_NAME_WORDS;
  const concept = pick(words.concepts);
  const place = pickOther(words.places, (p) => p.sg, [concept]);
  return compose(
    includeArticle ? "the" : "",
    concept,
    "of the",
    englishNounForm(place, englishNumber(place, 0.3)),
  );
}

/**
 * Builds "[article] Prefix-Noun" ("The Neo-Titans", "An Ultra-Phoenix").
 *
 * @param includeArticle - Whether to lead with an article.
 * @returns The name.
 */
function englishPrefixed(includeArticle: boolean): string {
  const words = EN_BAND_NAME_WORDS;
  const noun = pick(words.nouns.filter((n) => isSingleWord(n.sg)));
  const number = englishNumber(noun);
  const prefixed = joinPrefixEn(
    pick(words.prefixes),
    englishNounForm(noun, number),
  );
  return compose(
    englishLeadingArticle(includeArticle, noun, number, prefixed),
    prefixed,
  );
}

/**
 * Builds a name from the genre words: modifier + noun ("Steel Dragons"),
 * adjective + genre noun ("The Eternal Hammer") or noun + "of" + genre noun
 * ("Wolves of Steel").
 *
 * @param includeArticle - Whether to lead with an article.
 * @param genre - Genre hint.
 * @returns The name.
 */
function englishGenrePhrase(includeArticle: boolean, genre: NameGenre): string {
  const words = EN_BAND_NAME_WORDS;
  const genreWords = words.genres[genre];
  const variant = pick(["modifier", "adjective", "of"]);
  if (variant === "modifier") {
    const modifier = pick(genreWords.modifiers);
    const noun = pickOther(words.nouns, (n) => n.sg, [modifier]);
    return englishModifiedNoun(includeArticle, modifier, noun);
  }
  if (variant === "adjective") {
    return englishModifiedNoun(
      includeArticle,
      pick(words.adjectives),
      pick(genreWords.nouns),
    );
  }
  const head = pick(words.nouns);
  const number = englishNumber(head);
  const headForm = englishNounForm(head, number);
  const material = pickOther(genreWords.nouns, (n) => n.sg, [head.sg]);
  return compose(
    englishLeadingArticle(includeArticle, head, number, headForm),
    headForm,
    "of",
    englishComplement(material),
  );
}

type EnglishPattern = (includeArticle: boolean, genre?: NameGenre) => string;

const ENGLISH_PATTERNS: readonly EnglishPattern[] = [
  (includeArticle) =>
    englishModifiedNoun(
      includeArticle,
      pick(EN_BAND_NAME_WORDS.adjectives),
      pick(EN_BAND_NAME_WORDS.nouns),
    ),
  englishLinkedNouns,
  (includeArticle) =>
    englishModifiedNoun(
      includeArticle,
      pick(EN_BAND_NAME_WORDS.participles),
      pick(EN_BAND_NAME_WORDS.nouns),
    ),
  englishConceptOfPlace,
  englishPrefixed,
  (includeArticle) =>
    englishModifiedNoun(
      includeArticle,
      pick(EN_BAND_NAME_WORDS.colors),
      pick(EN_BAND_NAME_WORDS.nouns),
    ),
  (includeArticle, genre) =>
    genre
      ? englishGenrePhrase(includeArticle, genre)
      : ENGLISH_PATTERNS[0](includeArticle),
];

/**
 * Generates a single band name using a randomly chosen pattern. Seven shapes
 * are available per language (adjective, linked nouns, gerund/participle,
 * concept of place, prefix, color and genre); without a genre the last one
 * falls back to the adjective shape.
 *
 * @param options - Language (default "pt"), article (default `true`) and genre.
 * @returns A generated band name.
 */
export function generateBandName(options: GenerateNameOptions = {}): string {
  const language = options.language ?? "pt";
  const includeArticle = options.includeArticle ?? true;
  if (language === "en") {
    return pick(ENGLISH_PATTERNS)(includeArticle, options.genre);
  }
  return pick(ROMANCE_PATTERNS)(language, includeArticle, options.genre);
}

/**
 * Generates up to `count` unique band names (never more than 100).
 *
 * @param count - Desired number of names.
 * @param options - Language, article and genre options.
 * @returns The generated (deduplicated) names.
 */
export function generateBandNames(
  count: number,
  options: GenerateNameOptions = {},
): string[] {
  const names = new Set<string>();
  let guard = 0;
  const maxGuard = count * 20;
  while (names.size < count && names.size < 100 && guard < maxGuard) {
    names.add(generateBandName(options));
    guard += 1;
  }
  return [...names];
}
