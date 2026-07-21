import type { DepartureReason } from "@/modules/band-members/domain/entities/former-member.entity";

/**
 * One member to archive on departure (ADR-0010). The rest of the snapshot is
 * loaded from the still-live member before it is removed.
 */
export class MemberDepartureArchiveInput {
  /** The departing member's id. */
  memberId: string;
  /** Consecutive turns unpaid at departure. */
  unpaidTurns: number;
  /** Why the member left. */
  reason: DepartureReason;
}
