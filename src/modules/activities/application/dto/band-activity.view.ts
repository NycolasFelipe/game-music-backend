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
  createdAt: Date;
}
