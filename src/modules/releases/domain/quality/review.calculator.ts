import {
  ACCESS_FORMAT_WEIGHT,
  ACCESS_GENRE_WEIGHT,
  AMBITION_BUDGET_WEIGHT,
  AMBITION_FORMAT_WEIGHT,
  CRITIC_AMBITION_WEIGHT,
  CRITIC_INNOVATION_WEIGHT,
  CRITIC_QUALITY_WEIGHT,
  FAME_APPEAL_SCALE,
  PUBLIC_ACCESS_WEIGHT,
  PUBLIC_FAME_WEIGHT,
  PUBLIC_QUALITY_WEIGHT,
} from "@/modules/releases/domain/constants/review.constant";
import type { BudgetTierId } from "@/modules/releases/domain/data/budget-tiers";
import type { ReleaseFormatId } from "@/modules/releases/domain/data/release-formats";
import {
  BUDGET_AMBITION,
  FORMAT_RECEPTION,
  genreReceptionFor,
} from "@/modules/releases/domain/data/release-reception-profiles";

/**
 * Critic and public reception scoring (ADR-0011) — pure functions. Both scores
 * build on the already-computed `quality` plus format/genre/budget/fame signals;
 * no randomness (the variance already entered `quality`).
 */

/** The intermediate reception factors (persisted for transparency). */
export interface ReviewFactors {
  /** Public appeal from format + genre (0..1). */
  accessibility: number;
  /** Critical ambition from format + budget (0..1). */
  ambition: number;
  /** Experimental/critical credit from genre (0..1). */
  experimental: number;
  /** Public receptiveness from the band's fan base (0..1). */
  fameAppeal: number;
}

/** The critic and public scores (0..100) plus their factors. */
export interface ReviewScores {
  critic: number;
  public: number;
  factors: ReviewFactors;
}

/** Everything the reception scoring needs. */
export interface ReviewEvaluationInput {
  /** Technical quality (0..100), from {@link evaluateRelease}. */
  quality: number;
  /** The release format id. */
  formatId: string;
  /** The chosen budget tier id. */
  budgetTierId: string;
  /** The release style (a `BandTheme`). */
  style: string;
  /** The band's current fan count. */
  currentFans: number;
}

/** Clamps a value to `[min, max]`. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds to one decimal place. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Computes the critic and public reception scores for a finalized work
 * (ADR-0011 §2-3). The two diverge by construction: critics reward quality,
 * ambition and experimentation; the public rewards accessibility and reach.
 *
 * @param input - Quality plus the format/genre/budget/fame signals.
 * @returns The critic and public scores (0..100) and their factors.
 */
export function evaluateReviews(input: ReviewEvaluationInput): ReviewScores {
  const format =
    FORMAT_RECEPTION[input.formatId as ReleaseFormatId] ??
    FORMAT_RECEPTION.single;
  const genre = genreReceptionFor(input.style);
  const budgetAmbition =
    BUDGET_AMBITION[input.budgetTierId as BudgetTierId] ?? 0.6;

  const accessibility = clamp(
    format.accessibility * ACCESS_FORMAT_WEIGHT +
      genre.accessibility * ACCESS_GENRE_WEIGHT,
    0,
    1,
  );
  const ambition = clamp(
    format.ambition * AMBITION_FORMAT_WEIGHT +
      budgetAmbition * AMBITION_BUDGET_WEIGHT,
    0,
    1,
  );
  const experimental = clamp(genre.experimental, 0, 1);

  const fans = Math.max(0, input.currentFans);
  const fameAppeal = clamp(Math.log10(1 + fans) / FAME_APPEAL_SCALE, 0, 1);

  const critic = clamp(
    input.quality * CRITIC_QUALITY_WEIGHT +
      ambition * 100 * CRITIC_AMBITION_WEIGHT +
      experimental * 100 * CRITIC_INNOVATION_WEIGHT,
    0,
    100,
  );
  const publicScore = clamp(
    input.quality * PUBLIC_QUALITY_WEIGHT +
      accessibility * 100 * PUBLIC_ACCESS_WEIGHT +
      fameAppeal * 100 * PUBLIC_FAME_WEIGHT,
    0,
    100,
  );

  return {
    critic: round1(critic),
    public: round1(publicScore),
    factors: {
      accessibility: round1(accessibility * 100) / 100,
      ambition: round1(ambition * 100) / 100,
      experimental: round1(experimental * 100) / 100,
      fameAppeal: round1(fameAppeal * 100) / 100,
    },
  };
}
