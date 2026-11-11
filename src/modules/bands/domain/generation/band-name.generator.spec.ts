import {
  joinPrefixEn,
  joinPrefixEs,
  joinPrefixPt,
} from "@/common/language/grammar";
import {
  englishProblems,
  ES_CHECK_RULES,
  esPlurals,
  failures,
  indexEnglishWords,
  indexRomanceWords,
  inflectionProblems,
  PT_CHECK_RULES,
  ptPlurals,
  romanceProblems,
  seededRandom,
  type EnglishIndex,
  type WordReading,
} from "@/common/language/testing/agreement-checker";
import { EN_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-en";
import { ES_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-es";
import { PT_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-pt";
import {
  generateBandName,
  generateBandNames,
  type NameGenre,
} from "@/modules/bands/domain/generation/band-name.generator";
import type { RomanceLexicon } from "@/modules/bands/domain/generation/band-name.lexicon";

const GENRES: (NameGenre | undefined)[] = [
  undefined,
  "rock",
  "metal",
  "electronic",
  "punk",
];
const RUNS_PER_COMBINATION = 1500;
const ENGLISH_LINKS = new Set(["of", "from", "beyond", "within", "and"]);

/**
 * Generates a deterministic sample for one language, covering every genre and
 * both article settings.
 *
 * @param language - Name language.
 * @returns The generated names.
 */
function sample(language: "pt" | "es" | "en"): string[] {
  const names: string[] = [];
  jest.spyOn(Math, "random").mockImplementation(seededRandom(20261110));
  for (const genre of GENRES) {
    for (const includeArticle of [true, false]) {
      for (let i = 0; i < RUNS_PER_COMBINATION; i += 1) {
        names.push(generateBandName({ language, genre, includeArticle }));
      }
    }
  }
  jest.restoreAllMocks();
  return names;
}

/**
 * Collects every noun of a Romance band-name bank.
 *
 * @param words - Word bank.
 * @returns Nouns, places, concepts and genre nouns.
 */
function allNouns(words: RomanceLexicon) {
  const genres = Object.values(words.genres);
  return [
    ...words.nouns,
    ...words.places,
    ...words.concepts,
    ...genres.flatMap((g) => g.nouns),
  ];
}

/**
 * Collects every adjective of a Romance band-name bank.
 *
 * @param words - Word bank.
 * @returns Adjectives, colors and genre adjectives.
 */
function allAdjectives(words: RomanceLexicon) {
  const genres = Object.values(words.genres);
  return [
    ...words.adjectives,
    ...words.colors,
    ...genres.flatMap((g) => g.adjectives),
  ];
}

/**
 * Indexes a Romance band-name bank, prefixed nouns included.
 *
 * @param words - Word bank.
 * @param join - Prefix orthography of the language.
 * @returns Form -> readings.
 */
function indexRomance(
  words: RomanceLexicon,
  join: (prefix: string, word: string, proper: boolean) => string,
): Map<string, WordReading[]> {
  return indexRomanceWords({
    nouns: allNouns(words),
    adjectives: allAdjectives(words),
    prefixed: { nouns: words.nouns, prefixes: words.prefixes, join },
  });
}

/**
 * Indexes the English band-name bank.
 *
 * @returns The English index.
 */
function indexEnglish(): EnglishIndex {
  const words = EN_BAND_NAME_WORDS;
  const genres = Object.values(words.genres);
  return indexEnglishWords({
    nouns: [...words.nouns, ...words.places, ...genres.flatMap((g) => g.nouns)],
    massNouns: words.concepts,
    modifiers: [
      ...words.adjectives,
      ...words.participles,
      ...words.colors,
      ...genres.flatMap((g) => g.modifiers),
    ],
    prefixed: {
      nouns: words.nouns,
      prefixes: words.prefixes,
      join: joinPrefixEn,
    },
  });
}

/**
 * Gerund -> transitive map of a Romance bank.
 *
 * @param words - Word bank.
 * @returns The map.
 */
function gerunds(words: RomanceLexicon): Map<string, boolean> {
  return new Map(words.verbs.map((v) => [v.gerund, v.transitive]));
}

describe("band-name generator", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("Portuguese", () => {
    const names = sample("pt");
    const index = indexRomance(PT_BAND_NAME_WORDS, joinPrefixPt);

    it("makes article, contraction and adjective agree with the noun", () => {
      expect(
        failures(names, (n) =>
          romanceProblems(
            PT_CHECK_RULES,
            index,
            gerunds(PT_BAND_NAME_WORDS),
            n,
          ),
        ),
      ).toEqual([]);
    });

    it("covers every shape of name", () => {
      const has = (re: RegExp) => names.some((n) => re.test(n));
      expect(has(/^(Os|As) \S+/)).toBe(true);
      expect(has(/^(Um|Uma|Uns|Umas) /)).toBe(true);
      expect(has(/ (dos|das|nas|pelos|pelas) /)).toBe(true);
      expect(has(/ sem /)).toBe(true);
      expect(has(/^\S+ndo (o|a|os|as) /)).toBe(true);
      expect(has(/ \S+ndo$/)).toBe(true);
      expect(has(/(Pós|Pré|Pró|Ex|Vice)-/)).toBe(true);
      expect(has(/\b(Anti|Ultra|Neo)(rr|ss)/)).toBe(true);
      expect(has(/Cinza$/)).toBe(true);
      expect(has(/ de (Aço|Caveiras?|Espadas?)$/)).toBe(true);
    });

    it("keeps the words of the old bank that had no Portuguese form out", () => {
      const tokens = new Set(names.flatMap((n) => n.split(" ")));
      for (const word of [
        "Power",
        "Hard",
        "Heavy",
        "Spike",
        "Ultra",
        "Retro",
      ]) {
        expect(tokens.has(word)).toBe(false);
      }
      expect(names.some((n) => /\p{Ll}\p{Lu}/u.test(n))).toBe(false);
    });

    it("stores inflections that follow the plural and gender rules", () => {
      expect(
        inflectionProblems(
          allNouns(PT_BAND_NAME_WORDS),
          allAdjectives(PT_BAND_NAME_WORDS),
          ptPlurals,
        ),
      ).toEqual([]);
    });
  });

  describe("Spanish", () => {
    const names = sample("es");
    const index = indexRomance(ES_BAND_NAME_WORDS, joinPrefixEs);

    it("makes article, contraction and adjective agree with the noun", () => {
      expect(
        failures(names, (n) =>
          romanceProblems(
            ES_CHECK_RULES,
            index,
            gerunds(ES_BAND_NAME_WORDS),
            n,
          ),
        ),
      ).toEqual([]);
    });

    it("uses del, al and the personal 'a'", () => {
      expect(names.some((n) => / del /.test(n))).toBe(true);
      expect(names.some((n) => /ndo (al|a los|a las) /.test(n))).toBe(true);
      expect(names.some((n) => / de el /.test(n))).toBe(false);
      expect(names.some((n) => / a el /.test(n))).toBe(false);
    });

    it("stores inflections that follow the plural and gender rules", () => {
      expect(
        inflectionProblems(
          allNouns(ES_BAND_NAME_WORDS),
          allAdjectives(ES_BAND_NAME_WORDS),
          esPlurals,
        ),
      ).toEqual([]);
    });
  });

  describe("English", () => {
    const names = sample("en");
    const index = indexEnglish();

    it("follows English article, plural and preposition rules", () => {
      expect(
        failures(names, (n) => englishProblems(index, ENGLISH_LINKS, n)),
      ).toEqual([]);
    });

    it("uses a/an, plurals and hyphenated prefixes", () => {
      expect(names.some((n) => /^An /.test(n))).toBe(true);
      expect(names.some((n) => /^A /.test(n))).toBe(true);
      expect(names.some((n) => /Wolves/.test(n))).toBe(true);
      expect(names.some((n) => /^(The )?[A-Z][a-z]+-[A-Z]/.test(n))).toBe(true);
      expect(names.some((n) => /Reborning/.test(n))).toBe(false);
    });
  });

  it("defaults to Portuguese with article", () => {
    jest.spyOn(Math, "random").mockImplementation(seededRandom(1));
    const names = Array.from({ length: 200 }, () => generateBandName());
    const index = indexRomance(PT_BAND_NAME_WORDS, joinPrefixPt);
    expect(
      failures(names, (n) =>
        romanceProblems(PT_CHECK_RULES, index, gerunds(PT_BAND_NAME_WORDS), n),
      ),
    ).toEqual([]);
    expect(names.some((n) => /^(O|A|Os|As|Um|Uma|Uns|Umas) /.test(n))).toBe(
      true,
    );
  });

  it("generateBandNames returns unique names up to the requested count", () => {
    jest.spyOn(Math, "random").mockImplementation(seededRandom(2));
    const names = generateBandNames(12, { language: "pt", genre: "metal" });
    expect(names).toHaveLength(12);
    expect(new Set(names).size).toBe(12);
  });
});
