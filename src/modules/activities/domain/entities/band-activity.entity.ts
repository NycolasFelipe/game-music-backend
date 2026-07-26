/**
 * Domain representation of an activity the band held (ADR-0017 §5). Append-only
 * history: it is what answers "how many already happened this turn".
 */
export class BandActivityEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    /** The activity held (an `ActivityId`). */
    public readonly activityId: string,
    /** The band's live year when it happened. */
    public readonly heldAtYear: number,
    /** What it cost. */
    public readonly cost: number,
    /** Who was on the guest list. */
    public readonly participantIds: string[],
    /** Happiness each participant gained. */
    public readonly happinessDelta: number,
    /** Relationship levels each participating pair gained. */
    public readonly relationshipDelta: number,
    /** Whether it went wrong (ADR-0017 §3). */
    public readonly trouble: boolean,
    /** The active event the trouble spawned, when one was generated. */
    public readonly troubleEventId: string | null,
    /** The story of the night, one paragraph per entry (ADR-0017 §6). */
    public readonly story: string[],
    public readonly createdAt: Date,
  ) {}
}
