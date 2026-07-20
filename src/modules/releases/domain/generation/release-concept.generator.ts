/**
 * Release-concept generator — produces a "concept album" description in
 * Portuguese (the game's language). Pure beyond `Math.random()`. Optional seeds
 * (title, style label) let the caller weave in context.
 */

/** Options seeding concept generation. */
export interface GenerateConceptOptions {
  /** The work's title, woven into the description when provided. */
  title?: string;
  /** A human-readable style label (e.g. "Grunge"), woven in when provided. */
  styleLabel?: string;
}

const INTROS = [
  "Um mergulho em",
  "Uma jornada por",
  "Um retrato de",
  "Uma ode a",
  "Um manifesto sobre",
  "Um diário de",
];

const THEMES = [
  "a solidão das grandes cidades",
  "o fim de um amor",
  "a passagem do tempo",
  "a busca por pertencimento",
  "as ruínas da juventude",
  "a euforia e a queda",
  "os fantasmas do passado",
  "a esperança em tempos sombrios",
  "a estrada e o que ficou para trás",
  "a reinvenção de si mesmo",
];

const DEVELOPMENTS = [
  "costurando memórias e ruído",
  "entre o caos e a ternura",
  "em camadas de melancolia e fúria",
  "com melodias que insistem em resistir",
  "onde cada silêncio também canta",
  "misturando o íntimo e o épico",
];

const CLOSINGS = [
  "Cada faixa é um capítulo dessa história.",
  "Um trabalho para ouvir do começo ao fim.",
  "A trilha sonora de uma virada de página.",
  "Um convite a se perder e se encontrar.",
  "O disco que a banda precisava fazer.",
];

/** Picks a random element from a non-empty array. */
function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a concept-album description.
 *
 * @param options - Optional title/style seeds.
 * @returns A one-to-two sentence concept in Portuguese.
 */
export function generateReleaseConcept(
  options: GenerateConceptOptions = {},
): string {
  const styleClause = options.styleLabel
    ? ` Tudo sob a estética ${options.styleLabel}.`
    : "";
  const lead = options.title
    ? `"${options.title}" é ${lowerFirst(pick(INTROS))}`
    : pick(INTROS);
  return `${lead} ${pick(THEMES)}, ${pick(DEVELOPMENTS)}.${styleClause} ${pick(CLOSINGS)}`.trim();
}

/** Lowercases the first character of a string. */
function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
