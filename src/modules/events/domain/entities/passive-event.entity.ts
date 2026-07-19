import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";

/**
 * Domain representation of a passive (timeline/narrative) event in a band's
 * world history. Purely narrative — it has no effect on band state.
 */
export class PassiveEventEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    public readonly templateId: string,
    public readonly year: number,
    public readonly type: PassiveEventType,
    public readonly description: string,
    /** Names of the artists involved. */
    public readonly artists: string[],
    public readonly createdAt: Date,
  ) {}
}
