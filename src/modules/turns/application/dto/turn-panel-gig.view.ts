import type { GigPreviewView } from "@/modules/gigs/application/dto/gig-preview.view";
import type { GigView } from "@/modules/gigs/application/dto/gig.view";

/** The turn's live season: the one already played, if any, and the previews (ADR-0022). */
export class TurnPanelGigView {
  /** The season played in the current semester, or `null`. */
  playedThisTurn: GigView | null;
  /** One expected season per circuit. */
  previews: GigPreviewView[];
}
