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
  englishIndefiniteArticle,
  joinPrefixEn,
  joinPrefixEs,
  joinPrefixPt,
  joinWords,
  prepositionWithArticle,
  romanceArticle,
  type RomanceLanguage,
} from "@/common/language/grammar";
import type {
  EnglishNoun,
  GrammaticalNumber,
  RomanceAdjective,
  RomanceNoun,
} from "@/common/language/lexicon";
import {
  adjectiveForm,
  drawNumber,
  nounForm,
} from "@/common/language/inflection";
import { chance, pick, pickOther } from "@/common/language/random-pick";
import type {
  NameGenre,
  NameLanguage,
  RomanceLexicon,
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
  const nounText = nounForm(noun, number);
  const adjectiveText = adjectiveForm(adjective, noun.gender, number);
  return adjective.prenominal && chance(PRENOMINAL_CHANCE)
    ? `${adjectiveText} ${nounText}`
    : `${nounText} ${adjectiveText}`;
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
  const number = drawNumber(noun, PLURAL_CHANCE);
  return joinWords(
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
  const headNumber = drawNumber(head, PLURAL_CHANCE);
  const complement = pickOther(words.nouns, (n) => n.sg, [head.sg]);
  const complementNumber = drawNumber(complement, 0.5);
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
  return joinWords(
    romanceLeadingArticle(language, includeArticle, head, headNumber),
    nounForm(head, headNumber),
    linkPhrase,
    nounForm(complement, complementNumber),
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
    const number = drawNumber(noun, 0.5);
    const object = nounForm(noun, number);
    if (language === "es" && noun.animate) {
      const marker = prepositionWithArticle(language, "a", noun.gender, number);
      return joinWords(verb.gerund, marker, object);
    }
    if (number === "pl" && chance(0.4)) {
      return joinWords(verb.gerund, object);
    }
    const article = romanceArticle(language, "definite", noun.gender, number);
    return joinWords(verb.gerund, article, object);
  }
  const number = drawNumber(noun, 0.6);
  return joinWords(
    romanceLeadingArticle(language, includeArticle, noun, number),
    nounForm(noun, number),
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
  const placeNumber = drawNumber(place, 0.3);
  const article = includeArticle
    ? romanceArticle(language, "definite", concept.gender, "sg")
    : "";
  return joinWords(
    article,
    concept.sg,
    prepositionWithArticle(language, "de", place.gender, placeNumber),
    nounForm(place, placeNumber),
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
  const number = drawNumber(noun, PLURAL_CHANCE);
  const join = language === "pt" ? joinPrefixPt : joinPrefixEs;
  const prefixed = join(
    pick(words.prefixes),
    nounForm(noun, number),
    noun.proper ?? false,
  );
  return joinWords(
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
  const headNumber = drawNumber(head, PLURAL_CHANCE);
  const material = pickOther(genreWords.nouns, (n) => n.sg, [head.sg]);
  return joinWords(
    romanceLeadingArticle(language, includeArticle, head, headNumber),
    nounForm(head, headNumber),
    "de",
    nounForm(material, drawNumber(material, PLURAL_CHANCE)),
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
  const number = drawNumber(noun, PLURAL_CHANCE);
  return joinWords(
    englishLeadingArticle(includeArticle, noun, number, modifier),
    modifier,
    nounForm(noun, number),
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
  return `the ${nounForm(noun, drawNumber(noun, 0.3))}`;
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
  const number = drawNumber(head, PLURAL_CHANCE);
  const headForm = nounForm(head, number);
  const complement = pickOther(words.nouns, (n) => n.sg, [head.sg]);
  return joinWords(
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
  return joinWords(
    includeArticle ? "the" : "",
    concept,
    "of the",
    nounForm(place, drawNumber(place, 0.3)),
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
  const number = drawNumber(noun, PLURAL_CHANCE);
  const prefixed = joinPrefixEn(pick(words.prefixes), nounForm(noun, number));
  return joinWords(
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
  const number = drawNumber(head, PLURAL_CHANCE);
  const headForm = nounForm(head, number);
  const material = pickOther(genreWords.nouns, (n) => n.sg, [head.sg]);
  return joinWords(
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
