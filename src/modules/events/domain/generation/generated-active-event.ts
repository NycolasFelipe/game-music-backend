import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type { ResolvedEventOption } from "@/modules/events/domain/types/event-consequence";

/** Minimal character shape the generator needs. */
export interface EventCharacter {
  id: string;
  name: string;
  characteristics: string[];
}

/** Minimal relationship shape the generator needs (canonical pair + level). */
export interface EventRelationship {
  memberAId: string;
  memberBId: string;
  level: number;
}

/**
 * A freshly generated active event (not yet persisted): the instantiated
 * template with characters and options resolved for the current band state.
 */
export interface GeneratedActiveEvent {
  templateId: string;
  year: number;
  type: ActiveEventType;
  title: string;
  description: string;
  involvedCharacterIds: string[];
  options: ResolvedEventOption[];
}
