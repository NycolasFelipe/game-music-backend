import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";

/**
 * What the next turn advance would do to the band's cash, simulated with the
 * tick's own rules and nothing written (ADR-0022).
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
}
