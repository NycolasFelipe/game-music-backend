/**
 * A member who left the band, to record on the timeline (ADR-0010).
 */
export class MemberDepartureInput {
  /** The departed member's name. */
  memberName: string;
  /** How many turns they went unpaid before leaving. */
  unpaidTurns: number;
}
