import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";

/** Royalties credited in one turn tick, in total and per release (ADR-0020). */
export class RoyaltyAccrualView {
  /** Total credited this turn. */
  total: number;
  /** One entry per release that paid something this turn. */
  payouts: RoyaltyPayoutView[];
}
