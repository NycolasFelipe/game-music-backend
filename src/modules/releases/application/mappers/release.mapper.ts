import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import type { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";

/**
 * Maps a release domain entity to its public view.
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
