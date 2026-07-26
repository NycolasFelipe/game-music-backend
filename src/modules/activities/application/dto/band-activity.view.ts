/** Public view of an activity the band held (ADR-0017 §5). */
export class BandActivityView {
  id: string;
  bandId: string;
  activityId: string;
  heldAtYear: number;
  cost: number;
  participantIds: string[];
  happinessDelta: number;
  relationshipDelta: number;
  trouble: boolean;
  troubleEventId: string | null;
  /** The story of the night (ADR-0017 §6). */
  story: string[];
  createdAt: Date;
}
