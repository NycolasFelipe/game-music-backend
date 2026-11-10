import { EN_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-en";
import { ES_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-es";
import { PT_BAND_NAME_WORDS } from "@/modules/bands/domain/data/band-name-words-pt";
import {
  generateBandName,
  generateBandNames,
  type NameGenre,
} from "@/modules/bands/domain/generation/band-name.generator";
import {
  englishIndefiniteArticle,
  joinPrefixEn,
  joinPrefixEs,
  joinPrefixPt,
} from "@/modules/bands/domain/generation/band-name.grammar";
import type {
  EnglishNoun,
  RomanceAdjective,
  RomanceLexicon,
  RomanceNoun,
} from "@/modules/bands/domain/generation/band-name.lexicon";

// ---------------------------------------------------------------------------
// Deterministic randomness
// ---------------------------------------------------------------------------

/**
 * Small seeded PRNG (mulberry32) so every run draws the same names.
 *
 * @param seed - Any integer.
 * @returns A function with the `Math.random` contract.
 */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GENRES: (NameGenre | undefined)[] = [
  undefined,
  "rock",
  "metal",
  "electronic",
  "punk",
];
const RUNS_PER_COMBINATION = 1500;

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

// ---------------------------------------------------------------------------
// Portuguese / Spanish checker: parses a name back into noun phrases using the
// word banks and verifies agreement on the parsed structure.
// ---------------------------------------------------------------------------

type Features = `${"m" | "f"}${"sg" | "pl"}`;

interface WordReading {
  pos: "noun" | "adj";
  features: Set<Features>;
  lemma: string;
  prenominal: boolean;
  animate: boolean;
}

interface RomanceRules {
  words: RomanceLexicon;
  articles: Record<string, Features>;
  /** Preposition tokens; contracted ones carry the article features. */
  links: Record<string, Features | null>;
  /** Prepositions that never stand before a bare noun. */
  needArticle: Set<string>;
  join: (prefix: string, word: string, proper: boolean) => string;
}

const PT_RULES: RomanceRules = {
  words: PT_BAND_NAME_WORDS,
  articles: {
    o: "msg",
    a: "fsg",
    os: "mpl",
    as: "fpl",
    um: "msg",
    uma: "fsg",
    uns: "mpl",
    umas: "fpl",
  },
  links: {
    do: "msg",
    da: "fsg",
    dos: "mpl",
    das: "fpl",
    no: "msg",
    na: "fsg",
    nos: "mpl",
    nas: "fpl",
    pelo: "msg",
    pela: "fsg",
    pelos: "mpl",
    pelas: "fpl",
    de: null,
    em: null,
    por: null,
    sem: null,
  },
  needArticle: new Set(["em", "por"]),
  join: joinPrefixPt,
};

const ES_RULES: RomanceRules = {
  words: ES_BAND_NAME_WORDS,
  articles: {
    el: "msg",
    la: "fsg",
    los: "mpl",
    las: "fpl",
    un: "msg",
    una: "fsg",
    unos: "mpl",
    unas: "fpl",
  },
  links: {
    del: "msg",
    al: "msg",
    "más allá del": "msg",
    de: null,
    en: null,
    con: null,
    sin: null,
    a: null,
    "más allá de": null,
  },
  needArticle: new Set(["en", "a", "más allá de"]),
  join: joinPrefixEs,
};

/**
 * Indexes every inflected form of a Romance word bank (including prefixed
 * nouns) with its part of speech and gender/number features.
 *
 * @param rules - Language rules and word bank.
 * @returns Form -> possible readings.
 */
function indexRomance(rules: RomanceRules): Map<string, WordReading[]> {
  const index = new Map<string, WordReading[]>();
  const add = (form: string, reading: WordReading) => {
    index.set(form, [...(index.get(form) ?? []), reading]);
  };
  const addNoun = (noun: RomanceNoun, form = (w: string) => w) => {
    const base = {
      pos: "noun" as const,
      lemma: noun.sg,
      prenominal: false,
      animate: noun.animate ?? false,
    };
    const sg = new Set<Features>([`${noun.gender}sg`]);
    if (noun.pl === noun.sg) sg.add(`${noun.gender}pl`);
    add(form(noun.sg), { ...base, features: sg });
    if (noun.pl !== null && noun.pl !== noun.sg) {
      add(form(noun.pl), {
        ...base,
        features: new Set<Features>([`${noun.gender}pl`]),
      });
    }
  };
  const addAdjective = (adjective: RomanceAdjective) => {
    const byForm = new Map<string, Set<Features>>();
    const forms: [string, Features][] = [
      [adjective.ms, "msg"],
      [adjective.fs, "fsg"],
      [adjective.mp, "mpl"],
      [adjective.fp, "fpl"],
    ];
    for (const [form, features] of forms) {
      byForm.set(form, (byForm.get(form) ?? new Set()).add(features));
    }
    for (const [form, features] of byForm) {
      add(form, {
        pos: "adj",
        features,
        lemma: adjective.ms,
        prenominal: adjective.prenominal ?? false,
        animate: false,
      });
    }
  };
  const { words } = rules;
  const genres = Object.values(words.genres);
  [
    ...words.nouns,
    ...words.places,
    ...words.concepts,
    ...genres.flatMap((g) => g.nouns),
  ].forEach((noun) => addNoun(noun));
  [
    ...words.adjectives,
    ...words.colors,
    ...genres.flatMap((g) => g.adjectives),
  ].forEach(addAdjective);
  for (const noun of words.nouns.filter((n) => !/[\s-]/.test(n.sg))) {
    for (const prefix of words.prefixes) {
      addNoun(noun, (w) => rules.join(prefix, w, noun.proper ?? false));
    }
  }
  return index;
}

interface Phrase {
  link?: string;
  article?: string;
  words: string[];
}

/**
 * Checks one Portuguese or Spanish name and returns every rule it breaks.
 *
 * @param rules - Language rules and word bank.
 * @param index - Indexed forms of the bank.
 * @param name - Generated name.
 * @returns Human-readable problems (empty when the name is correct).
 */
function romanceProblems(
  rules: RomanceRules,
  index: Map<string, WordReading[]>,
  name: string,
): string[] {
  const problems: string[] = [];
  const gerunds = new Map(
    rules.words.verbs.map((v) => [v.gerund, v.transitive]),
  );
  const multiWord = [...Object.keys(rules.links), ...[...index.keys()]].filter(
    (k) => k.includes(" "),
  );
  multiWord.sort((a, b) => b.split(" ").length - a.split(" ").length);

  // Tokenize, then group into phrases separated by prepositions and gerunds.
  const raw = name.split(" ");
  const items: (Phrase | { gerund: string; transitive: boolean })[] = [];
  let current: Phrase | null = null;
  for (let i = 0; i < raw.length;) {
    const multi = multiWord.find(
      (m) => raw.slice(i, i + m.split(" ").length).join(" ") === m,
    );
    const token = multi ?? raw[i];
    i += multi ? multi.split(" ").length : 1;
    const lower = i === 1 ? token.toLowerCase() : token;
    if (i > 1 && token in rules.links) {
      if (current) items.push(current);
      current = { link: token, words: [] };
    } else if (
      lower in rules.articles &&
      !current?.words.length &&
      !current?.article
    ) {
      current ??= { words: [] };
      current.article = lower;
    } else if (gerunds.has(token)) {
      if (current) items.push(current);
      current = null;
      items.push({ gerund: token, transitive: gerunds.get(token) ?? false });
    } else if (index.has(token)) {
      current ??= { words: [] };
      current.words.push(token);
    } else {
      problems.push(`unknown word "${token}"`);
      return problems;
    }
  }
  if (current) items.push(current);

  const lemmas: string[] = [];
  items.forEach((item, position) => {
    if ("gerund" in item) {
      const next = items[position + 1];
      if (item.transitive) {
        if (position !== 0 || !next || "gerund" in next) {
          problems.push(`transitive gerund "${item.gerund}" misplaced`);
        }
      } else if (position === 0 || position !== items.length - 1) {
        problems.push(`intransitive gerund "${item.gerund}" not after noun`);
      }
      return;
    }
    // Try every noun/adjective reading; keep the one with fewest problems.
    const candidates: { errs: string[]; head: WordReading | null }[] = [];
    const choose = (k: number, chosen: WordReading[]) => {
      if (k < item.words.length) {
        for (const reading of index.get(item.words[k]) ?? []) {
          choose(k + 1, [...chosen, reading]);
        }
        return;
      }
      const errs: string[] = [];
      const nouns = chosen.filter((r) => r.pos === "noun");
      if (nouns.length !== 1) {
        errs.push(`phrase "${item.words.join(" ")}" has ${nouns.length} nouns`);
      } else {
        const head = nouns[0];
        const headAt = chosen.indexOf(head);
        if (item.article) {
          const f = rules.articles[item.article];
          if (!head.features.has(f)) errs.push(`article "${item.article}"`);
        }
        const linkFeatures = item.link ? rules.links[item.link] : null;
        if (linkFeatures && !head.features.has(linkFeatures)) {
          errs.push(`contraction "${item.link}"`);
        }
        if (
          item.link &&
          !linkFeatures &&
          !item.article &&
          rules.needArticle.has(item.link)
        ) {
          errs.push(`"${item.link}" without article`);
        }
        chosen.forEach((r, j) => {
          if (r.pos !== "adj") return;
          if (![...r.features].some((f) => head.features.has(f))) {
            errs.push(`adjective "${item.words[j]}" disagrees`);
          }
          if (j < headAt && !r.prenominal) {
            errs.push(`adjective "${item.words[j]}" before noun`);
          }
        });
      }
      candidates.push({ errs, head: nouns.length === 1 ? nouns[0] : null });
    };
    choose(0, []);
    const best = candidates.reduce<{
      errs: string[];
      head: WordReading | null;
    } | null>(
      (acc, c) => (acc === null || c.errs.length < acc.errs.length ? c : acc),
      null,
    );
    problems.push(...(best?.errs ?? ["empty phrase"]));
    const head = best?.head ?? null;
    if (head) {
      if (lemmas.includes(head.lemma)) problems.push(`repeats "${head.lemma}"`);
      lemmas.push(head.lemma);
      const previous = items[position - 1];
      if (previous && "gerund" in previous && previous.transitive) {
        const plural = [...head.features].some((f) => f.endsWith("pl"));
        if (!item.article && !item.link && !plural) {
          problems.push("gerund object is a bare singular");
        }
        if (rules === ES_RULES && head.animate && item.link !== "a") {
          if (item.link !== "al") problems.push("missing personal 'a'");
        }
      }
    }
  });
  return problems;
}

// ---------------------------------------------------------------------------
// English checker
// ---------------------------------------------------------------------------

interface EnglishReading {
  lemma: string;
  plural: boolean;
  singular: boolean;
  mass: boolean;
  proper: boolean;
}

/**
 * Indexes English nouns (plain and prefixed) and the set of words allowed
 * before a noun.
 *
 * @returns The noun index and the modifier set.
 */
function indexEnglish(): {
  nouns: Map<string, EnglishReading>;
  modifiers: Set<string>;
} {
  const words = EN_BAND_NAME_WORDS;
  const genres = Object.values(words.genres);
  const nouns = new Map<string, EnglishReading>();
  const addNoun = (noun: EnglishNoun, form = (w: string) => w) => {
    const base = { lemma: noun.sg, proper: noun.proper ?? false };
    const invariable = noun.pl === noun.sg;
    nouns.set(form(noun.sg), {
      ...base,
      singular: true,
      plural: invariable,
      mass: noun.pl === null && !noun.proper,
    });
    if (noun.pl !== null && !invariable) {
      nouns.set(form(noun.pl), {
        ...base,
        singular: false,
        plural: true,
        mass: false,
      });
    }
  };
  [...words.nouns, ...words.places, ...genres.flatMap((g) => g.nouns)].forEach(
    (noun) => addNoun(noun),
  );
  for (const concept of words.concepts) {
    addNoun({ sg: concept, pl: null });
  }
  for (const noun of words.nouns.filter((n) => !/\s/.test(n.sg))) {
    for (const prefix of words.prefixes) {
      addNoun(noun, (w) => joinPrefixEn(prefix, w));
    }
  }
  const modifiers = new Set([
    ...words.adjectives,
    ...words.participles,
    ...words.colors,
    ...genres.flatMap((g) => g.modifiers),
  ]);
  return { nouns, modifiers };
}

const ENGLISH_LINKS = new Set(["of", "from", "beyond", "within", "and"]);

/**
 * Checks one English name and returns every rule it breaks.
 *
 * @param index - Indexed English words.
 * @param name - Generated name.
 * @returns Human-readable problems (empty when the name is correct).
 */
function englishProblems(
  index: ReturnType<typeof indexEnglish>,
  name: string,
): string[] {
  const problems: string[] = [];
  const raw = name.split(" ");
  const phrases: Phrase[] = [{ words: [] }];
  for (let i = 0; i < raw.length; i += 1) {
    const pair = `${raw[i]} ${raw[i + 1]}`;
    const token = index.nouns.has(pair) ? pair : raw[i];
    if (token === pair) i += 1;
    const phrase = phrases[phrases.length - 1];
    const lower = token.toLowerCase();
    if (i > 0 && ENGLISH_LINKS.has(token)) {
      phrases.push({ link: token, words: [] });
    } else if (
      ["the", "a", "an", "some"].includes(lower) &&
      (i === 0 || token === lower) &&
      phrase.words.length === 0
    ) {
      phrase.article = lower;
    } else {
      phrase.words.push(token);
    }
  }
  const lemmas: string[] = [];
  for (const phrase of phrases) {
    const headWord = phrase.words[phrase.words.length - 1];
    const head = headWord === undefined ? undefined : index.nouns.get(headWord);
    if (!head) {
      problems.push(`phrase "${phrase.words.join(" ")}" does not end in noun`);
      continue;
    }
    for (const word of phrase.words.slice(0, -1)) {
      if (!index.modifiers.has(word)) problems.push(`"${word}" before noun`);
    }
    const { article } = phrase;
    if (article === "a" || article === "an") {
      if (!head.singular || head.mass || head.proper) {
        problems.push(`"${article}" before non-count noun`);
      } else if (article !== englishIndefiniteArticle(phrase.words[0])) {
        problems.push(`"${article}" before "${phrase.words[0]}"`);
      }
    }
    if (article === "some" && !head.plural) problems.push("some + singular");
    if (article && head.proper) problems.push("article before proper name");
    const countableSingular =
      head.singular && !head.plural && !head.mass && !head.proper;
    if (phrase.link && phrase.link !== "and" && !article && countableSingular) {
      problems.push(`"${phrase.link}" + bare singular "${headWord}"`);
    }
    if (lemmas.includes(head.lemma)) problems.push(`repeats "${head.lemma}"`);
    lemmas.push(head.lemma);
  }
  return problems;
}

/**
 * Runs a checker over names and keeps only the failing ones with reasons.
 *
 * @param names - Generated names.
 * @param check - Returns the problems of one name.
 * @returns "name: problem; problem" for each failing name.
 */
function failures(
  names: string[],
  check: (name: string) => string[],
): string[] {
  return names
    .map((name) => ({ name, problems: check(name) }))
    .filter(({ problems }) => problems.length > 0)
    .map(({ name, problems }) => `${name}: ${problems.join("; ")}`);
}

// ---------------------------------------------------------------------------
// Independent plural rules, used to audit the word-bank metadata.
// ---------------------------------------------------------------------------

/**
 * Accepted Portuguese plurals of a single word (regular rules, -ão variants
 * and invariable -s/-x words).
 *
 * @param word - Singular word.
 * @returns Acceptable plural spellings.
 */
function ptPlurals(word: string): string[] {
  const stem = (n: number) => word.slice(0, word.length - n);
  const out = [`${word}s`];
  if (/ão$/.test(word)) out.push(`${stem(2)}ões`, `${stem(2)}ães`);
  if (/m$/.test(word)) out.push(`${stem(1)}ns`);
  if (/[rz]$/.test(word)) out.push(`${word}es`);
  if (/al$/.test(word)) out.push(`${stem(1)}is`);
  if (/ul$/.test(word)) out.push(`${stem(1)}is`);
  if (/ol$/.test(word)) out.push(`${stem(2)}óis`);
  if (/[eé]l$/.test(word)) out.push(`${stem(2)}éis`, `${stem(2)}eis`);
  if (/[sx]$/.test(word)) out.push(word);
  return out;
}

/**
 * Accepted Spanish plurals of a single word: vowel + "s", consonant + "es"
 * (dropping the written accent of a stressed final syllable), z -> ces,
 * invariable -s/-x words and loanwords with plain "s".
 *
 * @param word - Singular word.
 * @returns Acceptable plural spellings.
 */
function esPlurals(word: string): string[] {
  const unaccentLast = word.replace(
    /([áéíóú])([^aeiouáéíóú]*)$/,
    (_, v: string, rest: string) =>
      `${v.normalize("NFD").replace(/[̀-ͯ]/g, "")}${rest}`,
  );
  const out = [`${word}s`, `${word}es`, `${unaccentLast}es`];
  if (/z$/.test(word)) out.push(`${word.slice(0, -1)}ces`);
  if (/[sx]$/.test(word)) out.push(word);
  return out;
}

/**
 * Checks a (possibly multi-word) noun's plural word by word.
 *
 * @param noun - Noun entry.
 * @param plurals - Rule set for one word.
 * @returns Whether every word of the plural follows the rules.
 */
function pluralFollowsRules(
  noun: RomanceNoun,
  plurals: (word: string) => string[],
): boolean {
  if (noun.pl === null) return true;
  const singular = noun.sg.split(/([\s-])/);
  const plural = noun.pl.split(/([\s-])/);
  return (
    singular.length === plural.length &&
    singular.every(
      (w, i) =>
        /^[\s-]$/.test(w) || w === plural[i] || plurals(w).includes(plural[i]),
    )
  );
}

/**
 * Lists every noun and adjective of a Romance bank whose inflection breaks
 * the plural/gender rules.
 *
 * @param words - Word bank.
 * @param plurals - Plural rule set for the language.
 * @returns The offending entries.
 */
function inflectionProblems(
  words: RomanceLexicon,
  plurals: (word: string) => string[],
): string[] {
  const genres = Object.values(words.genres);
  const nouns = [
    ...words.nouns,
    ...words.places,
    ...words.concepts,
    ...genres.flatMap((g) => g.nouns),
  ];
  const adjectives = [
    ...words.adjectives,
    ...words.colors,
    ...genres.flatMap((g) => g.adjectives),
  ];
  const bad = nouns
    .filter((n) => !pluralFollowsRules(n, plurals))
    .map((n) => `noun ${n.sg} -> ${n.pl}`);
  for (const a of adjectives) {
    const invariable = a.ms === a.mp;
    const pluralOk =
      invariable ||
      (plurals(a.ms).includes(a.mp) && plurals(a.fs).includes(a.fp));
    const genderOk =
      invariable || !/o$/.test(a.ms) || a.fs === `${a.ms.slice(0, -1)}a`;
    if (!pluralOk || !genderOk) {
      bad.push(`adjective ${a.ms}/${a.fs}/${a.mp}/${a.fp}`);
    }
  }
  return bad;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("band-name generator", () => {
  afterEach(() => jest.restoreAllMocks());

  describe("Portuguese", () => {
    const names = sample("pt");
    const index = indexRomance(PT_RULES);

    it("makes article, contraction and adjective agree with the noun", () => {
      expect(
        failures(names, (n) => romanceProblems(PT_RULES, index, n)),
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
      expect(inflectionProblems(PT_BAND_NAME_WORDS, ptPlurals)).toEqual([]);
    });
  });

  describe("Spanish", () => {
    const names = sample("es");
    const index = indexRomance(ES_RULES);

    it("makes article, contraction and adjective agree with the noun", () => {
      expect(
        failures(names, (n) => romanceProblems(ES_RULES, index, n)),
      ).toEqual([]);
    });

    it("uses del, al and the personal 'a'", () => {
      expect(names.some((n) => / del /.test(n))).toBe(true);
      expect(names.some((n) => /ndo (al|a los|a las) /.test(n))).toBe(true);
      expect(names.some((n) => / de el /.test(n))).toBe(false);
      expect(names.some((n) => / a el /.test(n))).toBe(false);
    });

    it("stores inflections that follow the plural and gender rules", () => {
      expect(inflectionProblems(ES_BAND_NAME_WORDS, esPlurals)).toEqual([]);
    });
  });

  describe("English", () => {
    const names = sample("en");
    const index = indexEnglish();

    it("follows English article, plural and preposition rules", () => {
      expect(failures(names, (n) => englishProblems(index, n))).toEqual([]);
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
    const index = indexRomance(PT_RULES);
    expect(failures(names, (n) => romanceProblems(PT_RULES, index, n))).toEqual(
      [],
    );
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
