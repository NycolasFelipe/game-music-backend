import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";

/**
 * Public view of a passive (timeline) event.
 */
export class PassiveEventView {
  id: string;
  bandId: string;
  templateId: string;
  year: number;
  type: PassiveEventType;
  description: string;
  artists: string[];
}
