/** What a pending item of the turn is (ADR-0022). */
export type TurnPendingKind =
  "active-event" | "studio-session" | "release-ready";

/** Something waiting on the player this turn (ADR-0022). */
export class TurnPendingItemView {
  /** The kind of pending item. */
  kind: TurnPendingKind;
  /** The active event, creation event or release id. */
  id: string;
  /** The release the item belongs to (studio sessions and ready works), else `null`. */
  releaseId: string | null;
  /** Display text: the event title, the session prompt or the work title. */
  title: string;
  /** Whether it blocks the turn advance. */
  blocking: boolean;
}
