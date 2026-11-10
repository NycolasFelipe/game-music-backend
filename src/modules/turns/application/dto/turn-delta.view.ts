/**
 * How the band changed since the previous turn closed (ADR-0020): everything the
 * player did during the turn (shows, releases, activities, events) plus the tick.
 */
export class TurnDeltaView {
  /** Balance change since the previous turn's snapshot. */
  balanceDelta: number;
  /** Fan change since the previous turn's snapshot. */
  fanCountDelta: number;
}
