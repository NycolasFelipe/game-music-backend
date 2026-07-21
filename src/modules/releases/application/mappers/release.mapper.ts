import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import type { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";
import { selectReviewComments } from "@/modules/releases/domain/data/review-comments";
import { mapReviewTier } from "@/modules/releases/domain/data/review-tiers";

/**
 * Maps a release domain entity to its public view. The critic/public review
 * tiers are derived from their scores, and the review comments are selected
 * deterministically from the release id (ADR-0011 §6).
 *
 * @param release - The release domain entity.
 * @returns The release view.
 */
export function toReleaseView(release: ReleaseEntity): ReleaseView {
  const comments =
    release.criticScore !== null && release.publicScore !== null
      ? selectReviewComments({
          id: release.id,
          criticScore: release.criticScore,
          publicScore: release.publicScore,
          format: release.format,
        })
      : null;

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
    criticComments: comments?.critic ?? [],
    publicComments: comments?.public ?? [],
    formatComment: comments?.format ?? null,
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
