/**
 * Domain representation of a recorded turn: an append-only snapshot of the
 * band's clock at the moment a turn was taken, plus references to any events
 * that turn produced. It is history/audit — the live year lives on the band.
 */
export class TurnEntity {
  constructor(
    public readonly id: string,
    /** Id of the band this turn belongs to. */
    public readonly bandId: string,
    /** The band's live year after this turn (half-year granularity). */
    public readonly year: number,
    /** Fan count captured when the turn was taken. */
    public readonly fanCountSnapshot: number,
    /** Cash balance captured after this turn (null for turns before it was tracked). */
    public readonly balanceSnapshot: number | null,
    /** Average member happiness captured this turn (null when untracked). */
    public readonly happinessAvgSnapshot: number | null,
    /** Average relationship level captured this turn (null when untracked). */
    public readonly relationshipAvgSnapshot: number | null,
    /** Id of the passive event generated this turn, if any. */
    public readonly passiveEventId: string | null,
    /** Id of the active event generated this turn, if any. */
    public readonly activeEventId: string | null,
    public readonly createdAt: Date,
  ) {}
}
