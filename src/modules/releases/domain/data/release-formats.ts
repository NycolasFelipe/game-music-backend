/**
 * Catalog of release formats. Data-driven so the roster and its economics can
 * be tuned without code changes (ADR-0008 §4). There is no permission gate:
 * an independent band may attempt any format — the difference a label makes is
 * cost and reach, not permission.
 */

/** Stable format identifiers. */
export const RELEASE_FORMAT_IDS = [
  "single",
  "ep",
  "lp",
  "album",
  "acoustic",
  "live",
] as const;

/** A release format identifier. */
export type ReleaseFormatId = (typeof RELEASE_FORMAT_IDS)[number];

/** Display + economic metadata for a release format. */
export interface ReleaseFormat {
  id: ReleaseFormatId;
  label: string;
  /** Inclusive track-count range for the format. */
  minTracks: number;
  maxTracks: number;
  /** Base production cost (before the budget-tier multiplier). */
  baseCost: number;
  /** Base fan reach (before quality/fame multipliers). */
  baseReach: number;
  /** Base revenue (before quality/fame multipliers). */
  baseRevenue: number;
}

/** The release-format catalog. */
export const RELEASE_FORMATS: ReleaseFormat[] = [
  {
    id: "single",
    label: "Single",
    minTracks: 1,
    maxTracks: 2,
    baseCost: 800,
    baseReach: 400,
    baseRevenue: 1200,
  },
  {
    id: "ep",
    label: "EP",
    minTracks: 3,
    maxTracks: 5,
    baseCost: 2000,
    baseReach: 1000,
    baseRevenue: 3000,
  },
  {
    id: "lp",
    label: "LP",
    minTracks: 8,
    maxTracks: 12,
    baseCost: 4000,
    baseReach: 2500,
    baseRevenue: 7000,
  },
  {
    id: "album",
    label: "Álbum",
    minTracks: 10,
    maxTracks: 14,
    baseCost: 6000,
    baseReach: 4000,
    baseRevenue: 12000,
  },
  {
    id: "acoustic",
    label: "Acústico",
    minTracks: 5,
    maxTracks: 8,
    baseCost: 2500,
    baseReach: 1200,
    baseRevenue: 3500,
  },
  {
    id: "live",
    label: "Ao Vivo",
    minTracks: 8,
    maxTracks: 16,
    baseCost: 3000,
    baseReach: 1800,
    baseRevenue: 5000,
  },
];

/**
 * Finds a release format by id.
 *
 * @param id - The format id.
 * @returns The format, or `undefined` when unknown.
 */
export function findReleaseFormat(id: string): ReleaseFormat | undefined {
  return RELEASE_FORMATS.find((format) => format.id === id);
}
