import { BandActivityView } from "@/modules/activities/application/dto/band-activity.view";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";

/** What an activity changed in the band, for the post-activity summary. */
export class ActivityResultView {
  /** The recorded activity. */
  activity: BandActivityView;
  /** The band's cash after paying for it. */
  balance: number;
  /** Effect multiplier applied (`1` for the first activity of the turn). */
  saturation: number;
  /** The chance it had of going wrong, for the player to read after the fact. */
  troubleChance: number;
  /** Whether it did go wrong. */
  trouble: boolean;
  /** Happiness moved, per participant. */
  participants: Array<{
    memberId: string;
    name: string;
    from: number;
    to: number;
  }>;
  /** Relationship levels moved, per participating pair. */
  relationshipChanges: Array<{
    memberAId: string;
    memberBId: string;
    from: number;
    to: number;
  }>;
  /** The decision the trouble raised, when it did (ADR-0017 §3). */
  troubleEvent: ActiveEventView | null;
}
