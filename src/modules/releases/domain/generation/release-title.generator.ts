/**
 * Release-title generator — album/single titles built from per-language word
 * banks whose words carry gender and number, so adjectives and contractions
 * agree with their noun ("Cinzas Eternas", "Saudade do Verão", "O Último
 * Verão", "Echoes of the Wind"). No side effects beyond `Math.random()`.
 */
import {
  joinWords,
  prepositionWithArticle,
  romanceArticle,
  type RomanceLanguage,
} from "@/common/language/grammar";
import {
  adjectiveForm,
  drawNumber,
  nounForm,
} from "@/common/language/inflection";
import type { EnglishNoun, RomanceNoun } from "@/common/language/lexicon";
import { chance, pick, pickOther } from "@/common/language/random-pick";
import {
  EN_RELEASE_TITLE_WORDS,
  ES_RELEASE_TITLE_WORDS,
  PT_RELEASE_TITLE_WORDS,
} from "@/modules/releases/domain/data/release-title-words";
import type {
  RomanceTitleWords,
  TitleLanguage,
} from "@/modules/releases/domain/generation/release-title.lexicon";

export type { TitleLanguage } from "@/modules/releases/domain/generation/release-title.lexicon";

/** Options controlling title generation. */
export interface GenerateTitleOptions {
  language?: TitleLanguage;
}

const ROMANCE_WORDS: Record<RomanceLanguage, RomanceTitleWords> = {
  pt: PT_RELEASE_TITLE_WORDS,
  es: ES_RELEASE_TITLE_WORDS,
};

/** Links between two nouns, repeated to weight the draw towards "de". */
const ROMANCE_LINKS: Record<RomanceLanguage, readonly string[]> = {
  pt: ["de", "de", "de", "sem"],
  es: ["de", "de", "sin", "en", "y"],
};

/** Links that always take a bare noun ("Verão sem Fogo", "Fuego y Ceniza"). */
const ALWAYS_BARE = new Set(["sem", "sin", "y"]);

/** English links between two nouns, weighted towards "of". */
const ENGLISH_LINKS = ["of", "of", "without", "in", "and"];

/** Chance of a plural noun when the noun has one. */
const PLURAL_CHANCE = 0.3;

/** Chance of "de" + bare noun ("Fantasmas de Concreto") over "do/da". */
const BARE_DE_CHANCE = 0.4;

/** Chance of a leading article ("O Fogo Selvagem", "The Lost Summer"). */
const ARTICLE_CHANCE = 0.25;

/** Chance of putting a prenominal adjective before the noun. */
const PRENOMINAL_CHANCE = 0.5;

// ---------------------------------------------------------------------------
// Portuguese and Spanish
// ---------------------------------------------------------------------------

/**
 * Builds "[article] adjective + noun" or "[article] noun + adjective" with
 * agreement ("Memórias Perdidas", "O Último Verão", "A Eterna Saudade").
 * An adjective in front of the noun brings the definite article more often,
 * as it reads more naturally.
 *
 * @param language - "pt" or "es".
 * @returns The title.
 */
function romanceAdjectiveTitle(language: RomanceLanguage): string {
  const words = ROMANCE_WORDS[language];
  const noun = pick([...words.nouns, ...words.abstracts]);
  const adjective = pick(words.adjectives);
  const number = drawNumber(noun, PLURAL_CHANCE);
  const nounText = nounForm(noun, number);
  const adjectiveText = adjectiveForm(adjective, noun.gender, number);
  const before =
    adjective.onlyBefore ||
    (adjective.prenominal === true && chance(PRENOMINAL_CHANCE));
  const article = chance(before ? 0.5 : ARTICLE_CHANCE)
    ? romanceArticle(language, "definite", noun.gender, number)
    : "";
  return before
    ? joinWords(article, adjectiveText, nounText)
    : joinWords(article, nounText, adjectiveText);
}

/**
 * Builds "head + link + noun" with the right contraction ("Eco do Abismo",
 * "Fantasmas de Concreto", "Verão sem Fogo", "Memoria en la Lluvia").
 *
 * @param language - "pt" or "es".
 * @param heads - Pool of head nouns (concrete or abstract).
 * @returns The title.
 */
function romanceLinkedTitle(
  language: RomanceLanguage,
  heads: readonly RomanceNoun[],
): string {
  const words = ROMANCE_WORDS[language];
  const head = pick(heads);
  const headNumber = drawNumber(head, PLURAL_CHANCE);
  const complement = pickOther(words.nouns, (n) => n.sg, [head.sg]);
  const complementNumber = drawNumber(complement, PLURAL_CHANCE);
  const link = pick(ROMANCE_LINKS[language]);
  const bare =
    ALWAYS_BARE.has(link) || (link === "de" && chance(BARE_DE_CHANCE));
  return joinWords(
    nounForm(head, headNumber),
    bare
      ? link
      : prepositionWithArticle(
          language,
          link,
          complement.gender,
          complementNumber,
        ),
    nounForm(complement, complementNumber),
  );
}

type RomancePattern = (language: RomanceLanguage) => string;

const ROMANCE_PATTERNS: readonly RomancePattern[] = [
  (language) => {
    const abstract = pick(ROMANCE_WORDS[language].abstracts);
    return nounForm(abstract, drawNumber(abstract, PLURAL_CHANCE));
  },
  romanceAdjectiveTitle,
  (language) => romanceLinkedTitle(language, ROMANCE_WORDS[language].nouns),
  (language) => romanceLinkedTitle(language, ROMANCE_WORDS[language].abstracts),
  (language) => {
    const noun = pick(ROMANCE_WORDS[language].nouns);
    return nounForm(noun, drawNumber(noun, PLURAL_CHANCE));
  },
];

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

/**
 * Returns the complement after an English link: a mass noun alone
 * ("of Fire"), a countable noun in the plural ("of Ghosts") or with "the"
 * ("of the Wind"). After "and" a countable singular may stand alone
 * ("Fire and Mirror").
 *
 * @param noun - Complement noun.
 * @param link - The link before it.
 * @returns The complement phrase.
 */
function englishComplement(noun: EnglishNoun, link: string): string {
  if (noun.pl === null) {
    return noun.sg;
  }
  if (chance(0.4)) {
    return noun.pl;
  }
  return link === "and" ? noun.sg : `the ${noun.sg}`;
}

/**
 * Builds "[The] adjective + noun" ("Lost Echoes", "The Last Summer").
 *
 * @returns The title.
 */
function englishAdjectiveTitle(): string {
  const words = EN_RELEASE_TITLE_WORDS;
  const noun = pick(words.nouns);
  const article = chance(ARTICLE_CHANCE) ? "the" : "";
  return joinWords(
    article,
    pick(words.adjectives),
    nounForm(noun, drawNumber(noun, PLURAL_CHANCE)),
  );
}

/**
 * Builds "head + link + complement" ("Echoes of the Wind", "Longing without
 * Shelter").
 *
 * @param head - Head word already inflected.
 * @param exclude - Lemma not to repeat in the complement.
 * @returns The title.
 */
function englishLinkedTitle(head: string, exclude: string): string {
  const link = pick(ENGLISH_LINKS);
  const complement = pickOther(EN_RELEASE_TITLE_WORDS.nouns, (n) => n.sg, [
    exclude,
  ]);
  return joinWords(head, link, englishComplement(complement, link));
}

const ENGLISH_PATTERNS: readonly (() => string)[] = [
  () => pick(EN_RELEASE_TITLE_WORDS.abstracts),
  englishAdjectiveTitle,
  () => {
    const noun = pick(EN_RELEASE_TITLE_WORDS.nouns);
    return englishLinkedTitle(
      nounForm(noun, drawNumber(noun, PLURAL_CHANCE)),
      noun.sg,
    );
  },
  () => {
    const abstract = pick(EN_RELEASE_TITLE_WORDS.abstracts);
    return englishLinkedTitle(abstract, abstract);
  },
  () => {
    const noun = pick(EN_RELEASE_TITLE_WORDS.nouns);
    return nounForm(noun, drawNumber(noun, PLURAL_CHANCE));
  },
];

/**
 * Generates a single release title. Five shapes per language: abstract alone
 * ("Saudade"), adjective + noun ("Cinzas Eternas"), noun + link + noun ("Eco
 * do Abismo"), abstract + link + noun ("Saudade do Verão") and noun alone.
 *
 * @param options - Language options (default "pt").
 * @returns A generated title.
 */
export function generateReleaseTitle(
  options: GenerateTitleOptions = {},
): string {
  const language = options.language ?? "pt";
  if (language === "en") {
    return pick(ENGLISH_PATTERNS)();
  }
  return pick(ROMANCE_PATTERNS)(language);
}

/**
 * Generates up to `count` unique release titles (never more than 100).
 *
 * @param count - Desired number of titles.
 * @param options - Language options.
 * @returns The generated (deduplicated) titles.
 */
export function generateReleaseTitles(
  count: number,
  options: GenerateTitleOptions = {},
): string[] {
  const titles = new Set<string>();
  let guard = 0;
  const maxGuard = count * 20;
  while (titles.size < count && titles.size < 100 && guard < maxGuard) {
    titles.add(generateReleaseTitle(options));
    guard += 1;
  }
  return [...titles];
}
