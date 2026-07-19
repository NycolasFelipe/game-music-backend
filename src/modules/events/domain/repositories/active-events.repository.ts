import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import type {
  EventConsequence,
  ResolvedEventOption,
} from "@/modules/events/domain/types/event-consequence";

/** DI token for the active-events repository implementation. */
export const ACTIVE_EVENTS_REPOSITORY = Symbol("ACTIVE_EVENTS_REPOSITORY");

/** Data required to persist a newly generated active event. */
export interface CreateActiveEventData {
  bandId: string;
  templateId: string;
  year: number;
  type: ActiveEventType;
  title: string;
  description: string;
  involvedCharacterIds: string[];
  options: ResolvedEventOption[];
}

/**
 * Persistence contract for active events. All operations are scoped by band.
 */
export interface ActiveEventsRepository {
  /**
   * Persists a newly generated (pending) active event.
   *
   * @param data - The generated event data.
   * @returns The created event.
   */
  create(data: CreateActiveEventData): Promise<ActiveEventEntity>;

  /**
   * Lists a band's events (newest first).
   *
   * @param bandId - The band id.
   * @returns The band's events.
   */
  findByBandId(bandId: string): Promise<ActiveEventEntity[]>;

  /**
   * Finds an event by id within a band.
   *
   * @param id - The event id.
   * @param bandId - The band id.
   * @returns The event, or `null` when not found in that band.
   */
  findByIdAndBandId(
    id: string,
    bandId: string,
  ): Promise<ActiveEventEntity | null>;

  /**
   * Counts a band's still-unresolved (pending) active events. Used to block a
   * turn advance while the player has a decision outstanding.
   *
   * @param bandId - The band id.
   * @returns The number of unresolved events for the band.
   */
  countUnresolved(bandId: string): Promise<number>;

  /**
   * Returns the template ids used by a band's events within a year window,
   * to avoid repeating recent events.
   *
   * @param bandId - The band id.
   * @param year - The reference year.
   * @param window - Half-width of the window, in years.
   * @returns The recently used template ids.
   */
  recentTemplateIds(
    bandId: string,
    year: number,
    window: number,
  ): Promise<string[]>;

  /**
   * Marks an event resolved with the chosen option and applied outcome.
   *
   * @param id - The event id.
   * @param bandId - The band id.
   * @param chosenOptionId - The id of the chosen option.
   * @param outcome - The applied consequence.
   * @returns The updated event, or `null` when not found in that band.
   */
  markResolved(
    id: string,
    bandId: string,
    chosenOptionId: string,
    outcome: EventConsequence,
  ): Promise<ActiveEventEntity | null>;
}
