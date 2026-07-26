/** Application-layer input for holding an activity (ADR-0017). */
export interface HoldActivityInput {
  /** The activity to hold (an `ActivityId`). */
  activityId: string;
  /** The guest list: which members go. */
  participantIds: string[];
}
