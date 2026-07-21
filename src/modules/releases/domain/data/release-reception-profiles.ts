import type { BandTheme } from "@/modules/bands/domain/constants/band.constant";
import type { BudgetTierId } from "@/modules/releases/domain/data/budget-tiers";
import type { ReleaseFormatId } from "@/modules/releases/domain/data/release-formats";

/**
 * Reception profiles (ADR-0011): how a work's **format** and **genre** shape the
 * critic and public scores. An editorial judgment, versioned and tunable.
 * Grouped into archetypes to keep the table maintainable while staying per
 * `BandTheme`, mirroring the genre skill-weight profiles (ADR-0008 §5).
 */

/** How a format reads to critics (`ambition`) and the public (`accessibility`). */
export interface FormatReception {
  /** Public appeal of the format (0..1): catchy/short scores higher. */
  accessibility: number;
  /** Critical ambition of the format (0..1): a big statement scores higher. */
  ambition: number;
}

/** How a genre reads to the public (`accessibility`) and critics (`experimental`). */
export interface GenreReception {
  /** Public appeal of the genre (0..1). */
  accessibility: number;
  /** Critical/experimental credit of the genre (0..1). */
  experimental: number;
}

/** Reception per release format. */
export const FORMAT_RECEPTION: Record<ReleaseFormatId, FormatReception> = {
  single: { accessibility: 1, ambition: 0.35 },
  ep: { accessibility: 0.85, ambition: 0.55 },
  lp: { accessibility: 0.6, ambition: 0.85 },
  album: { accessibility: 0.55, ambition: 1 },
  acoustic: { accessibility: 0.7, ambition: 0.65 },
  live: { accessibility: 0.75, ambition: 0.55 },
};

/** How much critical ambition a budget tier signals (0..1). */
export const BUDGET_AMBITION: Record<BudgetTierId, number> = {
  caseiro: 0.3,
  estudio: 0.6,
  grande: 1,
};

// Genre archetypes (kept in sync with the archetypes in release-genre-profiles).
const POP: GenreReception = { accessibility: 0.95, experimental: 0.15 };
const ELECTRONIC: GenreReception = { accessibility: 0.75, experimental: 0.45 };
const ROCK: GenreReception = { accessibility: 0.6, experimental: 0.5 };
const METAL: GenreReception = { accessibility: 0.35, experimental: 0.8 };
const SONGWRITER: GenreReception = { accessibility: 0.55, experimental: 0.6 };
const RAP: GenreReception = { accessibility: 0.7, experimental: 0.55 };
const ROOTS: GenreReception = { accessibility: 0.4, experimental: 0.85 };
const RHYTHM: GenreReception = { accessibility: 0.8, experimental: 0.4 };

/** Reception per band theme. */
export const GENRE_RECEPTION: Record<BandTheme, GenreReception> = {
  "indie-folk": SONGWRITER,
  grunge: ROCK,
  "rock-indie": ROCK,
  "rock-sinfonico": ROCK,
  punk: ROCK,
  metal: METAL,
  blues: ROOTS,
  jazz: ROOTS,
  synthwave: ELECTRONIC,
  cyberpunk: ELECTRONIC,
  steampunk: ELECTRONIC,
  "rave-edm": ELECTRONIC,
  "pop-urbano": POP,
  "rap-hiphop": RAP,
  "funk-carioca": RHYTHM,
  kpop: POP,
  "pop-mainstream": POP,
  "samba-raiz": RHYTHM,
  sertanejo: SONGWRITER,
  mpb: SONGWRITER,
  reggae: RHYTHM,
  "folk-rock": SONGWRITER,
  "egirl-eboy": ELECTRONIC,
  gotico: ROCK,
  "emo-scene": ROCK,
  "skate-streetwear": ROCK,
};

/** Default reception when a theme is somehow missing (defensive). */
export const DEFAULT_GENRE_RECEPTION: GenreReception = ROCK;

/**
 * Returns the reception profile for a band theme.
 *
 * @param theme - The band theme.
 * @returns The matching reception (falls back to {@link DEFAULT_GENRE_RECEPTION}).
 */
export function genreReceptionFor(theme: string): GenreReception {
  return GENRE_RECEPTION[theme as BandTheme] ?? DEFAULT_GENRE_RECEPTION;
}
