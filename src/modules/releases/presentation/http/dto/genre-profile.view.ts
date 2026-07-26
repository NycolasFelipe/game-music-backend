import type { SkillType } from "@/modules/band-members/domain/constants/skill.constant";

/**
 * How much each aspect (skill) weighs in a work of a given style (ADR-0008 §5).
 * Exposed so the creation screen can show which aspects matter for the chosen
 * style and forecast a draft's technical potential. Weights sum to 1.
 */
export class GenreProfileView {
  /** The style (a `BandTheme` id). */
  style: string;
  /** Display label for the style. */
  label: string;
  /** Weight per aspect (sums to 1). */
  weights: Record<SkillType, number>;
}
