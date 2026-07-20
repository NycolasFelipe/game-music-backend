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
  /** Cash balance captured after this turn (null for untracked older turns). */
  balance: number | null;
  /** Average member happiness captured this turn (null when untracked). */
  happinessAvg: number | null;
  /** Average relationship level captured this turn (null when untracked). */
  relationshipAvg: number | null;
  passiveEventId: string | null;
  activeEventId: string | null;
  createdAt: Date;
}
