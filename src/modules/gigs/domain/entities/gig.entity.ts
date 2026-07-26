/**
 * Domain representation of a live season the band played (ADR-0016). Append-only
 * history: one row per turn the band spent on a circuit.
 */
export class GigEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    /** The circuit played (a `GigTypeId`). */
    public readonly gigTypeId: string,
    /** The band's live year when the season was played. */
    public readonly playedAtYear: number,
    /** Fee earned. */
    public readonly fee: number,
    /** Cost paid (travel, gear, crew). */
    public readonly cost: number,
    /** Fans the season brought in. */
    public readonly fansGained: number,
    /** How well the band played, 0..1. */
    public readonly performance: number,
    /** Happiness the season left on each member. */
    public readonly happinessDelta: number,
    public readonly createdAt: Date,
  ) {}
}
