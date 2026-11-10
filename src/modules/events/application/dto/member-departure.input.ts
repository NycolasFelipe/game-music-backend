import type { DepartureReason } from "@/modules/band-members/domain/entities/former-member.entity";

/**
 * A member who left the band, to record on the timeline (ADR-0010, ADR-0032).
 */
export class MemberDepartureInput {
  /** The departed member's name. */
  memberName: string;
  /** How many turns they went unpaid before leaving. */
  unpaidTurns: number;
  /** Why the member left. */
  reason: DepartureReason;
}
