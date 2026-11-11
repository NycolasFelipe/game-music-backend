/**
 * Test support for the text generators: a seeded `Math.random`, a parser that
 * reads a generated phrase back through its word bank and lists every
 * agreement rule it breaks, and an independent audit of the plurals and
 * feminines stored in the banks. Used only by the generator specs.
 */
import {
  englishIndefiniteArticle,
  type RomanceLanguage,
} from "@/common/language/grammar";
import type {
  EnglishNoun,
  RomanceAdjective,
  RomanceNoun,
} from "@/common/language/lexicon";

/**
 * Small seeded PRNG (mulberry32), so a spec draws the same phrases on every
 * run.
 *
 * @param seed - Any integer.
 * @returns A function with the `Math.random` contract.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Runs a checker over phrases and keeps only the failing ones with reasons.
 *
 * @param phrases - Generated phrases.
 * @param check - Returns the problems of one phrase.
 * @returns "phrase: problem; problem" for each failing phrase.
 */
export function failures(
  phrases: readonly string[],
  check: (phrase: string) => string[],
): string[] {
  return phrases
    .map((phrase) => ({ phrase, problems: check(phrase) }))
    .filter(({ problems }) => problems.length > 0)
    .map(({ phrase, problems }) => `${phrase}: ${problems.join("; ")}`);
}

// ---------------------------------------------------------------------------
// Portuguese / Spanish
// ---------------------------------------------------------------------------

/** Gender + number of a form ("fpl" = feminine plural). */
export type Features = `${"m" | "f"}${"sg" | "pl"}`;

/** One possible reading of a word form. */
export interface WordReading {
  pos: "noun" | "adj";
  features: Set<Features>;
  lemma: string;
  prenominal: boolean;
  onlyBefore: boolean;
  animate: boolean;
}

/** Article and preposition tables of a Romance language. */
export interface RomanceCheckRules {
  language: RomanceLanguage;
  articles: Record<string, Features>;
  /** Preposition tokens; contracted ones carry the article features. */
  links: Record<string, Features | null>;
  /** Prepositions that never stand before a bare noun. */
  needArticle: Set<string>;
}

export const PT_CHECK_RULES: RomanceCheckRules = {
  language: "pt",
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
    ao: "msg",
    à: "fsg",
    aos: "mpl",
    às: "fpl",
    de: null,
    em: null,
    por: null,
    sem: null,
  },
  needArticle: new Set(["em", "por"]),
};

export const ES_CHECK_RULES: RomanceCheckRules = {
  language: "es",
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
    y: null,
    a: null,
    "más allá de": null,
  },
  needArticle: new Set(["en", "a", "más allá de"]),
};

/** Words of a Romance bank to index. */
export interface RomanceIndexInput {
  nouns: readonly RomanceNoun[];
  adjectives: readonly RomanceAdjective[];
  /** Prefixed forms the generator can build from `nouns`. */
  prefixed?: {
    nouns: readonly RomanceNoun[];
    prefixes: readonly string[];
    join: (prefix: string, word: string, proper: boolean) => string;
  };
}

/**
 * Indexes every inflected form (and prefixed noun) with its part of speech
 * and gender/number features.
 *
 * @param input - Nouns, adjectives and optional prefixes.
 * @returns Form -> possible readings.
 */
export function indexRomanceWords(
  input: RomanceIndexInput,
): Map<string, WordReading[]> {
  const index = new Map<string, WordReading[]>();
  const add = (form: string, reading: WordReading) => {
    index.set(form, [...(index.get(form) ?? []), reading]);
  };
  const addNoun = (noun: RomanceNoun, form = (w: string) => w) => {
    const base = {
      pos: "noun" as const,
      lemma: noun.sg,
      prenominal: false,
      onlyBefore: false,
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
  input.nouns.forEach((noun) => addNoun(noun));
  for (const adjective of input.adjectives) {
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
        onlyBefore: adjective.onlyBefore ?? false,
        animate: false,
      });
    }
  }
  const prefixed = input.prefixed;
  if (prefixed) {
    for (const noun of prefixed.nouns.filter((n) => !/[\s-]/.test(n.sg))) {
      for (const prefix of prefixed.prefixes) {
        addNoun(noun, (w) => prefixed.join(prefix, w, noun.proper ?? false));
      }
    }
  }
  return index;
}

interface Phrase {
  link?: string;
  article?: string;
  words: string[];
}

interface Gerund {
  gerund: string;
  transitive: boolean;
}

/**
 * Splits a phrase into noun phrases (with their article and preposition) and
 * gerunds. Returns a problem instead when a token is not in the bank.
 *
 * @param rules - Article and preposition tables.
 * @param index - Indexed forms.
 * @param gerunds - Gerund -> transitive.
 * @param text - Generated phrase.
 * @returns The parsed items or the unknown-word problem.
 */
function parseRomance(
  rules: RomanceCheckRules,
  index: Map<string, WordReading[]>,
  gerunds: ReadonlyMap<string, boolean>,
  text: string,
): (Phrase | Gerund)[] | string {
  const multiWord = [...Object.keys(rules.links), ...index.keys()].filter((k) =>
    k.includes(" "),
  );
  multiWord.sort((a, b) => b.split(" ").length - a.split(" ").length);
  const raw = text.split(" ");
  const items: (Phrase | Gerund)[] = [];
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
      return `unknown word "${token}"`;
    }
  }
  if (current) items.push(current);
  return items;
}

/**
 * Lists the problems of one noun phrase under a given noun/adjective reading.
 *
 * @param rules - Article and preposition tables.
 * @param phrase - The parsed phrase.
 * @param chosen - One reading per word.
 * @returns The problems and the head noun (null when there is not exactly one).
 */
function phraseProblems(
  rules: RomanceCheckRules,
  phrase: Phrase,
  chosen: WordReading[],
): { errs: string[]; head: WordReading | null } {
  const errs: string[] = [];
  const nouns = chosen.filter((r) => r.pos === "noun");
  if (nouns.length !== 1) {
    errs.push(`phrase "${phrase.words.join(" ")}" has ${nouns.length} nouns`);
    return { errs, head: null };
  }
  const head = nouns[0];
  const headAt = chosen.indexOf(head);
  if (phrase.article && !head.features.has(rules.articles[phrase.article])) {
    errs.push(`article "${phrase.article}"`);
  }
  const linkFeatures = phrase.link ? rules.links[phrase.link] : null;
  if (linkFeatures && !head.features.has(linkFeatures)) {
    errs.push(`contraction "${phrase.link}"`);
  }
  if (
    phrase.link &&
    !linkFeatures &&
    !phrase.article &&
    rules.needArticle.has(phrase.link)
  ) {
    errs.push(`"${phrase.link}" without article`);
  }
  chosen.forEach((r, j) => {
    if (r.pos !== "adj") return;
    if (![...r.features].some((f) => head.features.has(f))) {
      errs.push(`adjective "${phrase.words[j]}" disagrees`);
    }
    if (j < headAt && !r.prenominal) {
      errs.push(`adjective "${phrase.words[j]}" before noun`);
    }
    if (j > headAt && r.onlyBefore) {
      errs.push(`adjective "${phrase.words[j]}" after noun`);
    }
  });
  return { errs, head };
}

/**
 * Checks one Portuguese or Spanish phrase and returns every rule it breaks:
 * article, contraction and adjective agreement, adjective position, one noun
 * per noun phrase, prepositions that need an article, gerund placement, the
 * Spanish personal "a" and repeated words.
 *
 * @param rules - Article and preposition tables.
 * @param index - Indexed forms of the bank.
 * @param gerunds - Gerund -> transitive (empty when the bank has none).
 * @param text - Generated phrase.
 * @returns Human-readable problems (empty when the phrase is correct).
 */
export function romanceProblems(
  rules: RomanceCheckRules,
  index: Map<string, WordReading[]>,
  gerunds: ReadonlyMap<string, boolean>,
  text: string,
): string[] {
  const items = parseRomance(rules, index, gerunds, text);
  if (typeof items === "string") return [items];
  const problems: string[] = [];
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
      candidates.push(phraseProblems(rules, item, chosen));
    };
    choose(0, []);
    const best = candidates.reduce<(typeof candidates)[number] | null>(
      (acc, c) => (acc === null || c.errs.length < acc.errs.length ? c : acc),
      null,
    );
    problems.push(...(best?.errs ?? ["empty phrase"]));
    const head = best?.head ?? null;
    if (!head) return;
    if (lemmas.includes(head.lemma)) problems.push(`repeats "${head.lemma}"`);
    lemmas.push(head.lemma);
    const previous = items[position - 1];
    if (previous && "gerund" in previous && previous.transitive) {
      const plural = [...head.features].some((f) => f.endsWith("pl"));
      if (!item.article && !item.link && !plural) {
        problems.push("gerund object is a bare singular");
      }
      const personalA = item.link === "a" || item.link === "al";
      if (rules.language === "es" && head.animate && !personalA) {
        problems.push("missing personal 'a'");
      }
    }
  });
  return problems;
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

/** One reading of an English noun form. */
export interface EnglishReading {
  lemma: string;
  plural: boolean;
  singular: boolean;
  mass: boolean;
  proper: boolean;
}

/** Indexed English words. */
export interface EnglishIndex {
  nouns: Map<string, EnglishReading>;
  /** Words allowed before the head noun. */
  modifiers: Set<string>;
}

/** Words of an English bank to index. */
export interface EnglishIndexInput {
  nouns: readonly EnglishNoun[];
  /** Abstract nouns used without article. */
  massNouns?: readonly string[];
  modifiers: readonly string[];
  prefixed?: {
    nouns: readonly EnglishNoun[];
    prefixes: readonly string[];
    join: (prefix: string, word: string) => string;
  };
}

/**
 * Indexes English nouns (plain and prefixed) and the modifiers allowed before
 * them.
 *
 * @param input - Nouns, mass nouns, modifiers and optional prefixes.
 * @returns The index.
 */
export function indexEnglishWords(input: EnglishIndexInput): EnglishIndex {
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
  input.nouns.forEach((noun) => addNoun(noun));
  (input.massNouns ?? []).forEach((sg) => addNoun({ sg, pl: null }));
  const prefixed = input.prefixed;
  if (prefixed) {
    for (const noun of prefixed.nouns.filter((n) => !/\s/.test(n.sg))) {
      for (const prefix of prefixed.prefixes) {
        addNoun(noun, (w) => prefixed.join(prefix, w));
      }
    }
  }
  return { nouns, modifiers: new Set(input.modifiers) };
}

/**
 * Checks one English phrase and returns every rule it breaks: head noun last,
 * a/an by sound and only before countable singulars, "some" only before
 * plurals, no article before proper names, no bare countable singular after a
 * preposition ("of Wolf") and repeated words.
 *
 * @param index - Indexed English words.
 * @param links - Prepositions/conjunctions that split noun phrases.
 * @param text - Generated phrase.
 * @returns Human-readable problems (empty when the phrase is correct).
 */
export function englishProblems(
  index: EnglishIndex,
  links: ReadonlySet<string>,
  text: string,
): string[] {
  const problems: string[] = [];
  const raw = text.split(" ");
  const phrases: Phrase[] = [{ words: [] }];
  for (let i = 0; i < raw.length; i += 1) {
    const pair = `${raw[i]} ${raw[i + 1]}`;
    const token = index.nouns.has(pair) ? pair : raw[i];
    if (token === pair) i += 1;
    const phrase = phrases[phrases.length - 1];
    const lower = token.toLowerCase();
    if (i > 0 && links.has(token)) {
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

// ---------------------------------------------------------------------------
// Independent plural rules, used to audit the word-bank metadata.
// ---------------------------------------------------------------------------

/**
 * Accepted Portuguese plurals of a single word (regular rules, -ão variants,
 * -il as "-eis" or "-is" and invariable -s/-x words).
 *
 * @param word - Singular word.
 * @returns Acceptable plural spellings.
 */
export function ptPlurals(word: string): string[] {
  const stem = (n: number) => word.slice(0, word.length - n);
  const out = [`${word}s`];
  if (/ão$/.test(word)) out.push(`${stem(2)}ões`, `${stem(2)}ães`);
  if (/m$/.test(word)) out.push(`${stem(1)}ns`);
  if (/[rz]$/.test(word)) out.push(`${word}es`);
  if (/[au]l$/.test(word)) out.push(`${stem(1)}is`);
  if (/ol$/.test(word)) out.push(`${stem(2)}óis`);
  if (/[eé]l$/.test(word)) out.push(`${stem(2)}éis`, `${stem(2)}eis`);
  if (/il$/.test(word)) out.push(`${stem(2)}eis`, `${stem(1)}s`);
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
export function esPlurals(word: string): string[] {
  const unaccentLast = word.replace(
    /([áéíóú])([^aeiouáéíóú]*)$/,
    (_, vowel: string, rest: string) =>
      `${vowel.normalize("NFD").replace(/[̀-ͯ]/g, "")}${rest}`,
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
 * Lists every noun and adjective whose stored inflection breaks the plural or
 * gender rules.
 *
 * @param nouns - Nouns of a bank.
 * @param adjectives - Adjectives of a bank.
 * @param plurals - Plural rule set for the language.
 * @returns The offending entries.
 */
export function inflectionProblems(
  nouns: readonly RomanceNoun[],
  adjectives: readonly RomanceAdjective[],
  plurals: (word: string) => string[],
): string[] {
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
