/**
 * Labeled reception tiers (the "selos") shared by the critic and public scores
 * (ADR-0011). A single Metacritic-style ladder, applied to both — display-only
 * (no economic multipliers, unlike {@link QualityTier}). Colors live in the
 * frontend.
 */

/** Stable review-tier identifiers, worst to best. */
export const REVIEW_TIER_IDS = [
  "massacrado",
  "misto",
  "favoravel",
  "aclamado",
  "consagrado",
  "obra-prima",
] as const;

/** A review-tier identifier. */
export type ReviewTierId = (typeof REVIEW_TIER_IDS)[number];

/** Display metadata for a review tier. */
export interface ReviewTier {
  id: ReviewTierId;
  label: string;
  /** Star rating (1..5) shown for this tier. */
  stars: number;
  /** Inclusive lower bound (0..100) of the tier. */
  minScore: number;
}

/**
 * The review-tier ladder (ascending by `minScore`). `obra-prima` is the
 * exclusive top honor: it shares the 5-star display with `consagrado` but is
 * reserved for the rare masterpieces (distinguished by its label and color).
 */
export const REVIEW_TIERS: ReviewTier[] = [
  { id: "massacrado", label: "Massacrado", stars: 1, minScore: 0 },
  { id: "misto", label: "Misto", stars: 2, minScore: 40 },
  { id: "favoravel", label: "Favorável", stars: 3, minScore: 55 },
  { id: "aclamado", label: "Aclamado", stars: 4, minScore: 70 },
  { id: "consagrado", label: "Consagrado", stars: 5, minScore: 85 },
  { id: "obra-prima", label: "Obra-prima", stars: 5, minScore: 92 },
];

/**
 * Maps a numeric review score (0..100) to its tier: the highest tier whose
 * `minScore` the value reaches.
 *
 * @param score - The numeric review score (0..100).
 * @returns The matching review tier.
 */
export function mapReviewTier(score: number): ReviewTier {
  const value = Number.isFinite(score) ? score : 0;
  let matched = REVIEW_TIERS[0];
  for (const tier of REVIEW_TIERS) {
    if (value >= tier.minScore) {
      matched = tier;
    }
  }
  return matched;
}
