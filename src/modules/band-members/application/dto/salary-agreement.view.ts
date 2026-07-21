import type { SalaryChangeReason } from "@/modules/band-members/domain/constants/salary.constant";

/**
 * Public view of a single salary agreement (one entry of a member's salary
 * history, ADR-0010 §7).
 */
export class SalaryAgreementView {
  /** Agreed salary amount (per turn). */
  amount: number;
  /** In-game year the agreement took effect. */
  effectiveYear: number;
  /** Why the salary changed. */
  reason: SalaryChangeReason;
  /** When the agreement was recorded. */
  createdAt: Date;
}
