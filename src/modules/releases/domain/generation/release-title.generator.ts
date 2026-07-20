/**
 * Release-title generator — pure functions producing album/single titles.
 * Mirrors the band-name generator's shape (patterns over per-language word
 * banks). No side effects beyond `Math.random()`.
 */

/** Supported title languages. */
export type TitleLanguage = "pt" | "en" | "es";

/** Options controlling title generation. */
export interface GenerateTitleOptions {
  language?: TitleLanguage;
}

interface TitleBank {
  adjectives: string[];
  nouns: string[];
  abstracts: string[];
  connectors: string[];
}

const BANKS: Record<TitleLanguage, TitleBank> = {
  pt: {
    adjectives: [
      "Eterno",
      "Selvagem",
      "Silencioso",
      "Infinito",
      "Perdido",
      "Nu",
      "Distante",
      "Cru",
      "Elétrico",
      "Sagrado",
      "Frágil",
      "Último",
    ],
    nouns: [
      "Eco",
      "Fogo",
      "Cinza",
      "Verão",
      "Abismo",
      "Concreto",
      "Neon",
      "Vento",
      "Espelho",
      "Ruído",
      "Fantasma",
      "Refúgio",
    ],
    abstracts: [
      "Saudade",
      "Vertigem",
      "Insônia",
      "Delírio",
      "Memória",
      "Ausência",
      "Euforia",
      "Colapso",
      "Redenção",
      "Ruína",
    ],
    connectors: ["do", "da", "de", "sem"],
  },
  en: {
    adjectives: [
      "Eternal",
      "Wild",
      "Silent",
      "Endless",
      "Lost",
      "Naked",
      "Distant",
      "Raw",
      "Electric",
      "Sacred",
      "Fragile",
      "Last",
    ],
    nouns: [
      "Echo",
      "Fire",
      "Ashes",
      "Summer",
      "Abyss",
      "Concrete",
      "Neon",
      "Wind",
      "Mirror",
      "Noise",
      "Ghost",
      "Shelter",
    ],
    abstracts: [
      "Longing",
      "Vertigo",
      "Insomnia",
      "Delirium",
      "Memory",
      "Absence",
      "Euphoria",
      "Collapse",
      "Redemption",
      "Ruin",
    ],
    connectors: ["of", "without", "in", "and"],
  },
  es: {
    adjectives: [
      "Eterno",
      "Salvaje",
      "Silencioso",
      "Infinito",
      "Perdido",
      "Desnudo",
      "Distante",
      "Crudo",
      "Eléctrico",
      "Sagrado",
      "Frágil",
      "Último",
    ],
    nouns: [
      "Eco",
      "Fuego",
      "Ceniza",
      "Verano",
      "Abismo",
      "Concreto",
      "Neón",
      "Viento",
      "Espejo",
      "Ruido",
      "Fantasma",
      "Refugio",
    ],
    abstracts: [
      "Añoranza",
      "Vértigo",
      "Insomnio",
      "Delirio",
      "Memoria",
      "Ausencia",
      "Euforia",
      "Colapso",
      "Redención",
      "Ruina",
    ],
    connectors: ["del", "sin", "en", "y"],
  },
};

/** Picks a random element from a non-empty array. */
function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

type Pattern = (bank: TitleBank) => string;

const PATTERNS: Pattern[] = [
  (b) => pick(b.abstracts),
  (b) => `${pick(b.adjectives)} ${pick(b.nouns)}`,
  (b) => `${pick(b.nouns)} ${pick(b.connectors)} ${pick(b.nouns)}`,
  (b) => `${pick(b.abstracts)} ${pick(b.connectors)} ${pick(b.nouns)}`,
  (b) => pick(b.nouns),
];

/**
 * Generates a single release title.
 *
 * @param options - Language options.
 * @returns A generated title.
 */
export function generateReleaseTitle(
  options: GenerateTitleOptions = {},
): string {
  const bank = BANKS[options.language ?? "pt"];
  return pick(PATTERNS)(bank);
}

/**
 * Generates up to `count` unique release titles.
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
