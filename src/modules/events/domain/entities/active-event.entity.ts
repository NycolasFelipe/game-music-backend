import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type {
  EventConsequence,
  ResolvedEventOption,
} from "@/modules/events/domain/types/event-consequence";

/**
 * Domain representation of an active event instantiated for a band. Pending
 * until the player resolves it by choosing an option.
 */
export class ActiveEventEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    /** Id of the template this event was generated from. */
    public readonly templateId: string,
    public readonly year: number,
    public readonly type: ActiveEventType,
    public readonly title: string,
    public readonly description: string,
    public readonly involvedCharacterIds: string[],
    public readonly options: ResolvedEventOption[],
    public readonly resolved: boolean,
    /** Id of the chosen option, once resolved. */
    public readonly chosenOptionId: string | null,
    /** The applied consequence, once resolved. */
    public readonly outcome: EventConsequence | null,
    public readonly createdAt: Date,
    public readonly resolvedAt: Date | null,
  ) {}
}
