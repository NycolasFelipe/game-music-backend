import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";
import type { PassiveEventEntity } from "@/modules/events/domain/entities/passive-event.entity";
import type { RecentPassiveEvent } from "@/modules/events/domain/generation/generated-passive-event";

/** DI token for the passive-events repository implementation. */
export const PASSIVE_EVENTS_REPOSITORY = Symbol("PASSIVE_EVENTS_REPOSITORY");

/** Data required to persist a generated passive event. */
export interface CreatePassiveEventData {
  bandId: string;
  templateId: string;
  year: number;
  type: PassiveEventType;
  description: string;
  artists: string[];
}

/**
 * Persistence contract for passive events. All operations are scoped by band.
 */
export interface PassiveEventsRepository {
  /**
   * Persists many generated passive events at once.
   *
   * @param data - The passive events to create.
   * @returns The created events.
   */
  createMany(data: CreatePassiveEventData[]): Promise<PassiveEventEntity[]>;

  /**
   * Lists a band's passive events (newest first).
   *
   * @param bandId - The band id.
   * @returns The band's passive events.
   */
  findByBandId(bandId: string): Promise<PassiveEventEntity[]>;

  /**
   * Returns recent events (template id + artists) used by a band within a year
   * window, to avoid repeats.
   *
   * @param bandId - The band id.
   * @param year - The reference year.
   * @param window - Half-width of the window, in years.
   * @returns The recent events.
   */
  recentEvents(
    bandId: string,
    year: number,
    window: number,
  ): Promise<RecentPassiveEvent[]>;
}
