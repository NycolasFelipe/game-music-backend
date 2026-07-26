import type { FormerMemberView } from "@/modules/band-members/application/dto/former-member.view";
import type { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import type { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";
import type { ReleaseProductionView } from "@/modules/releases/application/dto/release-production.view";
import type { SalaryRaiseView } from "@/modules/turns/application/dto/salary-raise.view";

/**
 * Result of advancing a turn: the new clock plus anything the tick produced.
 */
export class AdvanceTurnView {
  /** The band's year before the step. */
  previousYear: number;
  /** The band's year after the step. */
  year: number;
  /** Human-readable period, e.g. `"2003 - 2º semestre"`. */
  period: string;
  /** Whether members aged this step (true only on a calendar-year rollover). */
  agedMembers: boolean;
  /** The passive (timeline) event generated this turn, if any. */
  passiveEvent: PassiveEventView | null;
  /** The active (decision) event rolled this turn, if any. */
  activeEvent: ActiveEventView | null;
  /** Total salaries owed this turn (ADR-0010). */
  salariesDue: number;
  /** Total salaries actually paid from the band's cash this turn. */
  salariesPaid: number;
  /** Whether every member was paid in full this turn. */
  salariesFullyPaid: boolean;
  /**
   * Salaries raised by the automatic adjustment this turn (ADR-0013). Always
   * empty when the save has the option off, or when the cash fell short.
   */
  salaryRaises: SalaryRaiseView[];
  /**
   * How the work in production moved this turn (ADR-0015): `null` when the band
   * is not recording anything.
   */
  production: ReleaseProductionView | null;
  /** Members who left the band this turn over unpaid salary (full snapshots). */
  departures: FormerMemberView[];
  /**
   * Ids of members in arrears who risk leaving if still unpaid. Deliberately
   * without a turn count — the exact deadline is hidden from the player.
   */
  atRiskMemberIds: string[];
}
