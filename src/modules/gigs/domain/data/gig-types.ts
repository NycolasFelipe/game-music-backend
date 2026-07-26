/**
 * Catalog of live circuits a band can play a season on (ADR-0016 §2). Data-driven
 * so the roster and its economics can be tuned without code changes. The fame
 * requirement is the gate: nobody books an unknown band for a festival.
 */

/** Stable circuit identifiers. */
export const GIG_TYPE_IDS = [
  "covers",
  "bar",
  "pub",
  "casa-shows",
  "festival",
] as const;

/** A live-circuit identifier. */
export type GigTypeId = (typeof GIG_TYPE_IDS)[number];

/** Display + economic metadata for a live circuit. */
export interface GigType {
  id: GigTypeId;
  label: string;
  description: string;
  /** Minimum fame level required to be booked (ADR-0007). */
  minFameLevel: number;
  /** Base seasonal fee, before performance and draw. */
  baseFee: number;
  /** Seasonal cost (travel, gear, crew), paid whatever the outcome. */
  cost: number;
  /** Base new fans for the season, before performance and draw. */
  baseFans: number;
  /** Happiness the season's grind takes from every member. */
  wear: number;
  /**
   * How much of the audience becomes the band's **own** fans. Covers nights pay
   * well but build almost nothing: it is someone else's music.
   */
  ownFansMultiplier: number;
}

/** The live-circuit catalog, from the first bar to the festival stage. */
export const GIG_TYPES: GigType[] = [
  {
    id: "covers",
    label: "Noite de covers",
    description:
      "Tocar o que a casa pede, do início ao fim. Paga em dia — e ninguém sai de lá fã de vocês.",
    minFameLevel: 0,
    baseFee: 600,
    cost: 80,
    baseFans: 8,
    wear: 0.15,
    ownFansMultiplier: 0.3,
  },
  {
    id: "bar",
    label: "Bares e botecos",
    description:
      "Repertório próprio para quem veio beber. Paga pouco, mas é onde a primeira base de fãs se forma.",
    minFameLevel: 0,
    baseFee: 450,
    cost: 60,
    baseFans: 40,
    wear: 0.1,
    ownFansMultiplier: 1,
  },
  {
    id: "pub",
    label: "Pubs e casas noturnas",
    description:
      "Palco de verdade, som decente e uma plateia que foi ver banda. O primeiro degrau profissional.",
    minFameLevel: 3,
    baseFee: 1200,
    cost: 250,
    baseFans: 180,
    wear: 0.2,
    ownFansMultiplier: 1,
  },
  {
    id: "casa-shows",
    label: "Casas de show",
    description:
      "Ingresso, camarim e fila na porta. Cachê que sustenta a banda — se a casa encher.",
    minFameLevel: 7,
    baseFee: 4000,
    cost: 900,
    baseFans: 900,
    wear: 0.3,
    ownFansMultiplier: 1,
  },
  {
    id: "festival",
    label: "Festivais",
    description:
      "Meia hora diante de milhares de pessoas que não vieram por vocês. Exaustivo — e transformador.",
    minFameLevel: 12,
    baseFee: 15000,
    cost: 3500,
    baseFans: 6000,
    wear: 0.5,
    ownFansMultiplier: 1,
  },
];

/**
 * Finds a live circuit by id.
 *
 * @param id - The circuit id.
 * @returns The circuit, or `undefined` when unknown.
 */
export function findGigType(id: string): GigType | undefined {
  return GIG_TYPES.find((type) => type.id === id);
}
