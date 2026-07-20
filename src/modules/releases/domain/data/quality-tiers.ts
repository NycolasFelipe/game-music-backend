/**
 * Labeled quality tiers a finished work falls into, mirroring the fame-tier
 * pattern (ADR-0007). Each tier scales the fans and revenue a release earns.
 */

/** Stable quality-tier identifiers, worst to best. */
export const QUALITY_TIER_IDS = [
  "fracasso",
  "mediocre",
  "solido",
  "grande",
  "obra-prima",
] as const;

/** A quality-tier identifier. */
export type QualityTierId = (typeof QUALITY_TIER_IDS)[number];

/** Display + economic metadata for a quality tier. */
export interface QualityTier {
  id: QualityTierId;
  label: string;
  emoji: string;
  /** Inclusive lower bound (0..100) of the tier. */
  minQuality: number;
  /** Multiplier applied to base fan reach. */
  fansMultiplier: number;
  /** Multiplier applied to base revenue. */
  revenueMultiplier: number;
}

/** The quality-tier ladder (ascending by `minQuality`). */
export const QUALITY_TIERS: QualityTier[] = [
  {
    id: "fracasso",
    label: "Fracasso",
    emoji: "💥",
    minQuality: 0,
    fansMultiplier: 0.3,
    revenueMultiplier: 0.3,
  },
  {
    id: "mediocre",
    label: "Medíocre",
    emoji: "😐",
    minQuality: 35,
    fansMultiplier: 0.7,
    revenueMultiplier: 0.7,
  },
  {
    id: "solido",
    label: "Sólido",
    emoji: "👍",
    minQuality: 55,
    fansMultiplier: 1,
    revenueMultiplier: 1,
  },
  {
    id: "grande",
    label: "Grande",
    emoji: "🔥",
    minQuality: 75,
    fansMultiplier: 1.6,
    revenueMultiplier: 1.7,
  },
  {
    id: "obra-prima",
    label: "Obra-prima",
    emoji: "🏆",
    minQuality: 90,
    fansMultiplier: 2.5,
    revenueMultiplier: 3,
  },
];

/**
 * Maps a numeric quality (0..100) to its tier: the highest tier whose
 * `minQuality` the value reaches.
 *
 * @param quality - The numeric quality (0..100).
 * @returns The matching quality tier.
 */
export function mapQualityTier(quality: number): QualityTier {
  const value = Number.isFinite(quality) ? quality : 0;
  let matched = QUALITY_TIERS[0];
  for (const tier of QUALITY_TIERS) {
    if (value >= tier.minQuality) {
      matched = tier;
    }
  }
  return matched;
}
