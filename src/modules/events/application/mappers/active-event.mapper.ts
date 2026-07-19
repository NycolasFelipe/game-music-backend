import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import type { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";

/**
 * Maps an active-event domain entity to its public view, stripping each
 * option's consequence to avoid leaking outcomes/probabilities.
 *
 * @param event - The active-event domain entity.
 * @returns The public view.
 */
export function toActiveEventView(event: ActiveEventEntity): ActiveEventView {
  return {
    id: event.id,
    bandId: event.bandId,
    templateId: event.templateId,
    year: event.year,
    type: event.type,
    title: event.title,
    description: event.description,
    involvedCharacterIds: event.involvedCharacterIds,
    options: event.options.map((o) => ({
      id: o.id,
      label: o.label,
      description: o.description,
    })),
    resolved: event.resolved,
    chosenOptionId: event.chosenOptionId,
    outcome: event.outcome,
  };
}
