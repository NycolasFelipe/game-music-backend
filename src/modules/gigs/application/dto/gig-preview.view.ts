/**
 * Expected outcome of a live season on one circuit, with the band as it is now
 * (ADR-0022). Values are the centre of the range: the real season draws its
 * performance variance uniformly in `1 ± GIG_VARIANCE`.
 */
export class GigPreviewView {
  /** The circuit (a `GigTypeId`). */
  gigTypeId: string;
  /** Display name of the circuit. */
  label: string;
  /** Fame level the circuit books from. */
  minFameLevel: number;
  /** Whether the band's fame level is enough for this circuit. */
  available: boolean;
  /** Performance the venue expects (ADR-0021); below it the road wears the band. */
  expectedPerformance: number;
  /** Expected seasonal fee. */
  fee: number;
  /** Seasonal cost. */
  cost: number;
  /** `fee - cost`. */
  net: number;
  /** Expected new fans. */
  fansGained: number;
  /** Expected happiness change on every member. */
  happinessDelta: number;
}
