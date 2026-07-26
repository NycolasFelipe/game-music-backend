import { BandActivityView } from "@/modules/activities/application/dto/band-activity.view";
import type { BandActivityEntity } from "@/modules/activities/domain/entities/band-activity.entity";

/**
 * Maps a band-activity domain entity to its public view.
 *
 * @param activity - The activity domain entity.
 * @returns The activity view.
 */
export function toBandActivityView(
  activity: BandActivityEntity,
): BandActivityView {
  return {
    id: activity.id,
    bandId: activity.bandId,
    activityId: activity.activityId,
    heldAtYear: activity.heldAtYear,
    cost: activity.cost,
    participantIds: activity.participantIds,
    happinessDelta: activity.happinessDelta,
    relationshipDelta: activity.relationshipDelta,
    trouble: activity.trouble,
    troubleEventId: activity.troubleEventId,
    createdAt: activity.createdAt,
  };
}
