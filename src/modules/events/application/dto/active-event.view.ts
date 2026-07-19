import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type { EventConsequence } from "@/modules/events/domain/types/event-consequence";

/**
 * A choosable option shown to the player. The underlying consequence is
 * intentionally omitted so outcomes/probabilities are not leaked before the
 * choice is made.
 */
export class ActiveEventOptionView {
  id: string;
  label: string;
  description: string;
}

/**
 * Public view of an active event.
 */
export class ActiveEventView {
  id: string;
  bandId: string;
  templateId: string;
  year: number;
  type: ActiveEventType;
  title: string;
  description: string;
  involvedCharacterIds: string[];
  options: ActiveEventOptionView[];
  resolved: boolean;
  chosenOptionId: string | null;
  /** The applied consequence, present only once resolved. */
  outcome: EventConsequence | null;
}
