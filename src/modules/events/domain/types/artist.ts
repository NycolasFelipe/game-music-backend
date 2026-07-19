/** Nationality of a world artist (closed set from the dataset). */
export type ArtistNationality = "brasileiro" | "estadunidense";

/**
 * A world artist used to populate passive (timeline) events. Field names follow
 * the ported dataset (Portuguese with underscores).
 */
export interface Artist {
  /** Artistic name. */
  nome: string;
  /** Decade tag (dataset string). */
  decada: string;
  /** Career start year. */
  ano_inicio: number;
  /** Career end year, or `null` if still active. */
  ano_fim_carreira: number | null;
  /** Whether it is a solo career (vs a band). */
  solo: boolean;
  /** Nationality. */
  nacionalidade: ArtistNationality;
}
