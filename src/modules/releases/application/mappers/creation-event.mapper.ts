import { CreationEventView } from "@/modules/releases/application/dto/creation-event.view";
import { ReleaseWithEventsView } from "@/modules/releases/application/dto/release-with-events.view";
import { toReleaseView } from "@/modules/releases/application/mappers/release.mapper";
import type { CreationEventEntity } from "@/modules/releases/domain/entities/creation-event.entity";
import type { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";

/**
 * Maps a creation-event domain entity to its public view, stripping the option
 * effects (the odds are resolved server-side and never shown to the client).
 *
 * @param event - The creation-event domain entity.
 * @returns The creation-event view.
 */
export function toCreationEventView(
  event: CreationEventEntity,
): CreationEventView {
  return {
    id: event.id,
    sequence: event.sequence,
    kind: event.kind,
    prompt: event.prompt,
    options: event.options.map((option) => ({
      id: option.id,
      label: option.label,
      description: option.description,
    })),
    resolved: event.resolved,
    chosenOptionId: event.chosenOptionId,
    qualityModifier: event.qualityModifier,
  };
}

/**
 * Composes a release with its creation events into a single view.
 *
 * @param release - The release entity.
 * @param events - The release's creation events.
 * @returns The composed view.
 */
export function toReleaseWithEventsView(
  release: ReleaseEntity,
  events: CreationEventEntity[],
): ReleaseWithEventsView {
  return {
    ...toReleaseView(release),
    creationEvents: events.map(toCreationEventView),
  };
}
