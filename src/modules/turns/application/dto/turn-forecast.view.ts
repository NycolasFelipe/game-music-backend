import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";

/**
 * What the next turn advance would do to the band's cash and members,
 * simulated with the tick's own rules and nothing written (ADR-0022,
 * ADR-0032).
 */
export class TurnForecastView {
  /** Cash now. */
  balance: number;
  /** Royalties the tick would credit. */
  royalties: number;
  /** Royalties per release that would pay. */
  royaltyPayouts: RoyaltyPayoutView[];
  /** Total the automatic adjustment would add to the payroll (0 when off or when cash falls short). */
  salaryRaises: number;
  /** Salaries due after the raises. */
  payroll: number;
  /** Cash after royalties and the salaries the cash can cover. */
  balanceAfter: number;
  /** Members who would be left unpaid and stay in the band. */
  atRiskMemberIds: string[];
  /** Members who would leave the band over unpaid salary on this advance. */
  departingMemberIds: string[];
  /**
   * Members who would end this advance in a bad mood and leave if it lasts one
   * more (ADR-0032 §5).
   */
  moodAtRiskMemberIds: string[];
  /** Members who would leave the band over a lasting bad mood on this advance. */
  moodDepartingMemberIds: string[];
  /** Fans the band would lose to these departures (ADR-0032 §5). */
  fansLost: number;
}
