import { Inject, Injectable } from "@nestjs/common";
import { royaltyPayout } from "@/modules/releases/domain/quality/release.calculator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Accrues one turn of royalties for a band's launched releases (ADR-0008 §8).
 * Pays out a decaying share of each release's royalty tail and decrements it,
 * returning the total to credit to the band. Called by the turn tick — the
 * caller applies the total to the band's balance.
 */
@Injectable()
export class AccrueReleaseRoyaltiesUseCase {
  constructor(
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Accrues one turn of royalties for a band.
   *
   * @param bandId - The band id.
   * @returns The total royalty amount to credit this turn.
   */
  async execute(bandId: string): Promise<number> {
    const releases =
      await this.releasesRepository.findActiveRoyaltyReleases(bandId);
    let credited = 0;

    for (const release of releases) {
      const payout = royaltyPayout(
        release.royaltyRemaining,
        release.royaltyTurnsLeft,
      );
      if (payout <= 0) {
        continue;
      }
      credited += payout;
      await this.releasesRepository.applyRoyaltyPayout(release.id, {
        royaltyRemaining: Math.max(
          0,
          Math.round((release.royaltyRemaining - payout) * 100) / 100,
        ),
        royaltyTurnsLeft: Math.max(0, release.royaltyTurnsLeft - 1),
      });
    }

    return Math.round(credited * 100) / 100;
  }
}
