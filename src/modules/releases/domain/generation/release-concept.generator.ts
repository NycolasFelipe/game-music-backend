/**
 * Release-concept generator — produces a "concept album" description in
 * Portuguese (the game's language). Pure beyond `Math.random()`. Optional seeds
 * (title, style label) let the caller weave in context.
 *
 * Each opening ends in a preposition and each theme stores the gender and
 * number of its first word, so the preposition fuses with the theme's article
 * ("um mergulho na solidão", "uma ode à passagem do tempo", "um retrato dos
 * fantasmas do passado").
 */
import { lowerFirst, prepositionWithArticle } from "@/common/language/grammar";
import type { Gender, GrammaticalNumber } from "@/common/language/lexicon";
import { pick } from "@/common/language/random-pick";

/** Options seeding concept generation. */
export interface GenerateConceptOptions {
  /** The work's title, woven into the description when provided. */
  title?: string;
  /** A human-readable style label (e.g. "Grunge"), woven in when provided. */
  styleLabel?: string;
}

/** Opening of the concept and the preposition that introduces the theme. */
interface ConceptIntro {
  readonly text: string;
  readonly preposition: string;
}

/** Theme without its leading article, with the article's gender/number. */
interface ConceptTheme {
  readonly gender: Gender;
  readonly number: GrammaticalNumber;
  readonly text: string;
}

const INTROS: readonly ConceptIntro[] = [
  { text: "Um mergulho", preposition: "em" },
  { text: "Uma jornada", preposition: "por" },
  { text: "Um retrato", preposition: "de" },
  { text: "Uma ode", preposition: "a" },
  { text: "Um manifesto", preposition: "sobre" },
  { text: "Um diário", preposition: "de" },
];

const THEMES: readonly ConceptTheme[] = [
  { gender: "f", number: "sg", text: "solidão das grandes cidades" },
  { gender: "m", number: "sg", text: "fim de um amor" },
  { gender: "f", number: "sg", text: "passagem do tempo" },
  { gender: "f", number: "sg", text: "busca por pertencimento" },
  { gender: "f", number: "pl", text: "ruínas da juventude" },
  { gender: "f", number: "sg", text: "euforia que vem antes da queda" },
  { gender: "m", number: "pl", text: "fantasmas do passado" },
  { gender: "f", number: "sg", text: "esperança em tempos sombrios" },
  { gender: "m", number: "sg", text: "que ficou para trás na estrada" },
  { gender: "f", number: "sg", text: "reinvenção de si mesmo" },
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
  const intro = pick(INTROS);
  const lead = options.title
    ? `"${options.title}" é ${lowerFirst(intro.text)}`
    : intro.text;
  const theme = pick(THEMES);
  const link = prepositionWithArticle(
    "pt",
    intro.preposition,
    theme.gender,
    theme.number,
  );
  return `${lead} ${link} ${theme.text}, ${pick(DEVELOPMENTS)}.${styleClause} ${pick(CLOSINGS)}`.trim();
}
