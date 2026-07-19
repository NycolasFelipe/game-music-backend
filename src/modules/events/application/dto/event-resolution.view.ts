import type { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import type { EventConsequence } from "@/modules/events/domain/types/event-consequence";

/** The absolute band-state values applied by resolving an event. */
export class AppliedBandChanges {
  fanCount: number;
  memberHappiness: Array<{ memberId: string; happiness: number }>;
  relationshipLevels: Array<{
    memberAId: string;
    memberBId: string;
    level: number;
  }>;
}

/**
 * Result of resolving an active event: the resolved event, the rolled outcome,
 * and the concrete changes applied to the band.
 */
export class EventResolutionView {
  event: ActiveEventView;
  outcome: EventConsequence;
  applied: AppliedBandChanges;
}
