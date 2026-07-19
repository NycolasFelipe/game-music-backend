import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";

/**
 * A freshly generated passive event (not yet persisted).
 */
export interface GeneratedPassiveEvent {
  templateId: string;
  year: number;
  type: PassiveEventType;
  description: string;
  /** Names of the artists involved. */
  artists: string[];
}

/**
 * A recently generated passive event, used to avoid repeats.
 */
export interface RecentPassiveEvent {
  templateId: string;
  artists: string[];
}
