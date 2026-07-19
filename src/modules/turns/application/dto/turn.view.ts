/**
 * Public view of a recorded turn (one entry of the band's turn timeline).
 */
export class TurnView {
  /** The band's live year after this turn. */
  year: number;
  /** Human-readable period, e.g. `"2003 - 2º semestre"`. */
  period: string;
  /** Fan count captured when the turn was taken. */
  fanCount: number;
  passiveEventId: string | null;
  activeEventId: string | null;
  createdAt: Date;
}
