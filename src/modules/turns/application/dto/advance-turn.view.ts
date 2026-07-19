import type { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import type { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";

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
}
