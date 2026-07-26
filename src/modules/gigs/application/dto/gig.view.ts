/** Public view of a live season the band played (ADR-0016). */
export class GigView {
  id: string;
  bandId: string;
  /** The circuit played (a `GigTypeId`). */
  gigTypeId: string;
  /** The band's live year when the season was played. */
  playedAtYear: number;
  fee: number;
  cost: number;
  /** `fee - cost`, what landed in the band's cash. */
  net: number;
  fansGained: number;
  /** How well the band played, 0..1. */
  performance: number;
  /** Happiness the season left on each member. */
  happinessDelta: number;
  createdAt: Date;
}
