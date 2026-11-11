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
} from "@/common/language/testing/agreement-checker";
import {
  EN_RELEASE_TITLE_WORDS,
  ES_RELEASE_TITLE_WORDS,
  PT_RELEASE_TITLE_WORDS,
} from "@/modules/releases/domain/data/release-title-words";
import {
  generateReleaseTitle,
  generateReleaseTitles,
  type TitleLanguage,
} from "@/modules/releases/domain/generation/release-title.generator";

const RUNS = 6000;
const NO_GERUNDS = new Map<string, boolean>();
const ENGLISH_LINKS = new Set(["of", "without", "in", "and"]);

/**
 * Words that date a text or break the tone rules: titles appear in the Gazeta
 * and in reviews of any year (ADR-0024) and never address the player or
 * swear (ADR-0026).
 */
const FORBIDDEN =
  /internet|online|celular|rede social|redes|viral|stream|playlist|digital|você|vocês|you\b|porra|merda|caralho|fuck|shit/i;

/**
 * Generates a deterministic sample of titles for one language.
 *
 * @param language - Title language.
 * @returns The generated titles.
 */
function sample(language: TitleLanguage): string[] {
  jest.spyOn(Math, "random").mockImplementation(seededRandom(20261110));
  const titles = Array.from({ length: RUNS }, () =>
    generateReleaseTitle({ language }),
  );
  jest.restoreAllMocks();
  return titles;
}

describe("release-title.generator", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("Portuguese", () => {
    const titles = sample("pt");
    const words = PT_RELEASE_TITLE_WORDS;
    const index = indexRomanceWords({
      nouns: [...words.nouns, ...words.abstracts],
      adjectives: words.adjectives,
    });

    it("makes adjectives and contractions agree with the noun", () => {
      expect(
        failures(titles, (t) =>
          romanceProblems(PT_CHECK_RULES, index, NO_GERUNDS, t),
        ),
      ).toEqual([]);
    });

    it("covers every shape of title", () => {
      const has = (re: RegExp) => titles.some((t) => re.test(t));
      expect(has(/^\S+$/)).toBe(true);
      expect(has(/ (do|da|dos|das) /)).toBe(true);
      expect(has(/ de \S+$/)).toBe(true);
      expect(has(/ sem /)).toBe(true);
      expect(has(/^(O|A|Os|As) Últim[oa]s? /)).toBe(true);
      expect(has(/Cinzas \S+as$/)).toBe(true);
      expect(has(/ Últim[oa]s?$/)).toBe(false);
    });

    it("stores inflections that follow the plural and gender rules", () => {
      expect(
        inflectionProblems(
          [...words.nouns, ...words.abstracts],
          words.adjectives,
          ptPlurals,
        ),
      ).toEqual([]);
    });

    it("keeps the titles timeless and in tone", () => {
      expect(titles.filter((t) => FORBIDDEN.test(t))).toEqual([]);
    });
  });

  describe("Spanish", () => {
    const titles = sample("es");
    const words = ES_RELEASE_TITLE_WORDS;
    const index = indexRomanceWords({
      nouns: [...words.nouns, ...words.abstracts],
      adjectives: words.adjectives,
    });

    it("makes adjectives and contractions agree with the noun", () => {
      expect(
        failures(titles, (t) =>
          romanceProblems(ES_CHECK_RULES, index, NO_GERUNDS, t),
        ),
      ).toEqual([]);
    });

    it("uses del and puts an article after en", () => {
      expect(titles.some((t) => / del /.test(t))).toBe(true);
      expect(titles.some((t) => / en (el|la|los|las) /.test(t))).toBe(true);
      expect(titles.some((t) => / de el /.test(t))).toBe(false);
    });

    it("stores inflections that follow the plural and gender rules", () => {
      expect(
        inflectionProblems(
          [...words.nouns, ...words.abstracts],
          words.adjectives,
          esPlurals,
        ),
      ).toEqual([]);
    });

    it("keeps the titles timeless and in tone", () => {
      expect(titles.filter((t) => FORBIDDEN.test(t))).toEqual([]);
    });
  });

  describe("English", () => {
    const titles = sample("en");
    const words = EN_RELEASE_TITLE_WORDS;
    const index = indexEnglishWords({
      nouns: words.nouns,
      massNouns: words.abstracts,
      modifiers: words.adjectives,
    });

    it("never puts a bare countable singular after a preposition", () => {
      expect(
        failures(titles, (t) => englishProblems(index, ENGLISH_LINKS, t)),
      ).toEqual([]);
    });

    it("uses plurals and 'the' in complements", () => {
      expect(titles.some((t) => / of the /.test(t))).toBe(true);
      expect(titles.some((t) => /Echoes/.test(t))).toBe(true);
    });

    it("keeps the titles timeless and in tone", () => {
      expect(titles.filter((t) => FORBIDDEN.test(t))).toEqual([]);
    });
  });

  it("defaults to Portuguese", () => {
    jest.spyOn(Math, "random").mockImplementation(seededRandom(1));
    const words = PT_RELEASE_TITLE_WORDS;
    const index = indexRomanceWords({
      nouns: [...words.nouns, ...words.abstracts],
      adjectives: words.adjectives,
    });
    const titles = Array.from({ length: 200 }, () => generateReleaseTitle());
    expect(
      failures(titles, (t) =>
        romanceProblems(PT_CHECK_RULES, index, NO_GERUNDS, t),
      ),
    ).toEqual([]);
  });

  it("generates the requested number of unique titles", () => {
    jest.spyOn(Math, "random").mockImplementation(seededRandom(2));
    const titles = generateReleaseTitles(12);
    expect(titles).toHaveLength(12);
    expect(new Set(titles).size).toBe(12);
  });
});
