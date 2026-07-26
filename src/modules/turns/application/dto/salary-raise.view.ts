/**
 * One salary raised by the automatic adjustment during a turn (ADR-0013 §5).
 */
export class SalaryRaiseView {
  memberId: string;
  /** The member's name (so the summary reads without another lookup). */
  name: string;
  /** Salary before the raise. */
  from: number;
  /** Salary after the raise (the member's target). */
  to: number;
}
