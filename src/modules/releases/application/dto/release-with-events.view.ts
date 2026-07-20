import { CreationEventView } from "@/modules/releases/application/dto/creation-event.view";
import { ReleaseView } from "@/modules/releases/application/dto/release.view";

/** A release composed with its creation events (for the creation flow). */
export class ReleaseWithEventsView extends ReleaseView {
  creationEvents: CreationEventView[];
}
