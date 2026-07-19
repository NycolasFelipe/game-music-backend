/**
 * Public view of a band's fame standing, derived from its fan count.
 */
export class FameView {
  /** Fame level, `0..30`. */
  level: number;
  title: string;
  subtitle: string;
  /** `true` when at the top level (no further progression). */
  isMaxLevel: boolean;
  /** Inclusive minimum fans for the current level. */
  currentLevelMinFans: number;
  /** Inclusive maximum fans for the current level (`null` at max level). */
  currentLevelMaxFans: number | null;
  /** Fans required to reach the next level (`null` at max level). */
  nextLevelAtFans: number | null;
}
