import { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";
import type { PassiveEventEntity } from "@/modules/events/domain/entities/passive-event.entity";

/**
 * Maps a passive-event domain entity to its public view.
 *
 * @param event - The passive-event domain entity.
 * @returns The public view.
 */
export function toPassiveEventView(
  event: PassiveEventEntity,
): PassiveEventView {
  return {
    id: event.id,
    bandId: event.bandId,
    templateId: event.templateId,
    year: event.year,
    type: event.type,
    description: event.description,
    artists: event.artists,
  };
}
