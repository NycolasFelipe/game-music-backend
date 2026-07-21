import type {
  ReleaseCreationLogEntry,
  ReleaseCredits,
  ReleaseDetails,
  ReleaseStatus,
} from "@/modules/releases/domain/constants/release.constant";

/**
 * Domain representation of a musical work (release). A draft (`em_criacao`)
 * carries only its authorship; the outcome fields (quality, revenue, …) are
 * `null` until it is finalized (`lancada`). Belongs to a single band via
 * {@link bandId}. Anemic by design — logic lives in the release calculator.
 */
export class ReleaseEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    public readonly title: string,
    public readonly concept: string,
    public readonly format: string,
    public readonly style: string,
    public readonly budgetTier: string,
    public readonly status: ReleaseStatus,
    public readonly credits: ReleaseCredits,
    /** Numeric quality 0..100 (null until finalized). */
    public readonly quality: number | null,
    public readonly qualityTier: string | null,
    /** Critic reception score 0..100 (null until finalized / legacy). */
    public readonly criticScore: number | null,
    /** Public reception score 0..100 (null until finalized / legacy). */
    public readonly publicScore: number | null,
    public readonly fansGained: number | null,
    public readonly cost: number | null,
    public readonly masterRevenueTotal: number | null,
    public readonly publishingRevenueTotal: number | null,
    /** Remaining royalty tail still to be paid out over turns. */
    public readonly royaltyRemaining: number,
    /** Turns of royalty payout still remaining. */
    public readonly royaltyTurnsLeft: number,
    /** The band's live year when the work was launched (null until finalized). */
    public readonly releasedAtYear: number | null,
    public readonly creationLog: ReleaseCreationLogEntry[],
    public readonly details: ReleaseDetails | null,
    public readonly createdAt: Date,
  ) {}
}
