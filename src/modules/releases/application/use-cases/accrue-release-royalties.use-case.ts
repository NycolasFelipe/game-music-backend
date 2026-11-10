import { Inject, Injectable, Logger } from "@nestjs/common";
import type { RoyaltyAccrualView } from "@/modules/releases/application/dto/royalty-accrual.view";
import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";
import { royaltyPayout } from "@/modules/releases/domain/quality/release.calculator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Accrues one turn of royalties for a band's launched releases (ADR-0008 §8).
 * Pays out a decaying share of each release's royalty tail and decrements it,
 * returning the total to credit to the band and the breakdown per release
 * (ADR-0020). Called by the turn tick — the caller applies the total to the
 * band's balance.
 */
@Injectable()
export class AccrueReleaseRoyaltiesUseCase {
  private readonly logger = new Logger(AccrueReleaseRoyaltiesUseCase.name);

  constructor(
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Accrues one turn of royalties for a band.
   *
   * Flow: loads the releases still earning; for each, computes the decaying
   * payout (`royaltyPayout`), persists the shrunken tail and records the
   * payout. Releases whose payout rounds to zero are skipped and left out of
   * the breakdown.
   *
   * @param bandId - The band id.
   * @returns The total to credit this turn and the payout of each release.
   */
  async execute(bandId: string): Promise<RoyaltyAccrualView> {
    const releases =
      await this.releasesRepository.findActiveRoyaltyReleases(bandId);
    let credited = 0;
    const payouts: RoyaltyPayoutView[] = [];
    for (const release of releases) {
      const payout = royaltyPayout(
        release.royaltyRemaining,
        release.royaltyTurnsLeft,
      );
      if (payout <= 0) {
        continue;
      }
      credited += payout;
      const remaining = Math.max(
        0,
        Math.round((release.royaltyRemaining - payout) * 100) / 100,
      );
      const turnsLeft = Math.max(0, release.royaltyTurnsLeft - 1);
      await this.releasesRepository.applyRoyaltyPayout(release.id, {
        royaltyRemaining: remaining,
        royaltyTurnsLeft: turnsLeft,
      });
      payouts.push({
        releaseId: release.id,
        title: release.title,
        amount: payout,
        turnsLeft,
        remaining,
      });
    }
    const total = Math.round(credited * 100) / 100;
    if (payouts.length > 0) {
      this.logger.log(
        `Band ${bandId}: ${total} in royalties from ${payouts.length} release(s).`,
      );
    }
    return { total, payouts };
  }
}
