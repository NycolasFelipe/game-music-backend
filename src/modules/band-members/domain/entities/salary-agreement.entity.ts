import type { SalaryChangeReason } from "@/modules/band-members/domain/constants/salary.constant";

/**
 * Domain representation of a salary agreement — one append-only entry in a
 * member's salary history (ADR-0010 §1). The member's current salary is the
 * denormalized `band_members.salary` column; this is the audit/renegotiation log.
 */
export class SalaryAgreementEntity {
  constructor(
    public readonly id: string,
    /** Member this agreement belongs to. */
    public readonly memberId: string,
    /** Band the member belongs to (denormalized for band-scoped queries). */
    public readonly bandId: string,
    /** Agreed salary amount (per turn). */
    public readonly amount: number,
    /** In-game year the agreement took effect. */
    public readonly effectiveYear: number,
    /** Why the salary changed. */
    public readonly reason: SalaryChangeReason,
    public readonly createdAt: Date,
  ) {}
}
