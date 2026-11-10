/** Royalties one release paid into the band's cash this turn (ADR-0020). */
export class RoyaltyPayoutView {
  /** The release that paid. */
  releaseId: string;
  /** The release title, for display. */
  title: string;
  /** Amount credited this turn. */
  amount: number;
  /** Payments still due after this one (0 when the tail is exhausted). */
  turnsLeft: number;
  /** Royalties still to be paid after this one. */
  remaining: number;
}
