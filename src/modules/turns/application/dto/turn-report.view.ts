import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";
import type { TurnDeltaView } from "@/modules/turns/application/dto/turn-delta.view";

/**
 * Money and fans of a turn, explained (ADR-0020). The tick obeys
 * `balanceAfter = balanceBefore + royalties - salariesPaid`.
 */
export class TurnReportView {
  /** Cash when the player advanced (after the turn's actions, before the tick). */
  balanceBefore: number;
  /** Royalties credited by the tick. */
  royalties: number;
  /** Royalties per release that paid this turn. */
  royaltyPayouts: RoyaltyPayoutView[];
  /** Salaries paid by the tick. */
  salariesPaid: number;
  /** Cash after the tick. */
  balanceAfter: number;
  /** Fans after the tick (the tick itself never changes fans). */
  fanCount: number;
  /**
   * Change since the previous turn closed. `null` on the band's first turn or
   * when the previous turn has no balance snapshot.
   */
  sinceLastTurn: TurnDeltaView | null;
}
