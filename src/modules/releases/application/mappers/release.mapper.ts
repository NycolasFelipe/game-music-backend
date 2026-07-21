import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import type { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";
import { mapReviewTier } from "@/modules/releases/domain/data/review-tiers";

/**
 * Maps a release domain entity to its public view. The critic/public review
 * tiers are derived from their scores (ADR-0011 §6).
 *
 * @param release - The release domain entity.
 * @returns The release view.
 */
export function toReleaseView(release: ReleaseEntity): ReleaseView {
  return {
    id: release.id,
    bandId: release.bandId,
    title: release.title,
    concept: release.concept,
    format: release.format,
    style: release.style,
    budgetTier: release.budgetTier,
    status: release.status,
    credits: release.credits,
    quality: release.quality,
    qualityTier: release.qualityTier,
    criticScore: release.criticScore,
    publicScore: release.publicScore,
    criticTier:
      release.criticScore !== null
        ? mapReviewTier(release.criticScore).id
        : null,
    publicTier:
      release.publicScore !== null
        ? mapReviewTier(release.publicScore).id
        : null,
    fansGained: release.fansGained,
    cost: release.cost,
    masterRevenueTotal: release.masterRevenueTotal,
    publishingRevenueTotal: release.publishingRevenueTotal,
    royaltyRemaining: release.royaltyRemaining,
    royaltyTurnsLeft: release.royaltyTurnsLeft,
    releasedAtYear: release.releasedAtYear,
    creationLog: release.creationLog,
    details: release.details,
    createdAt: release.createdAt,
  };
}
