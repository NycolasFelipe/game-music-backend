import type { TurnForecastView } from "@/modules/turns/application/dto/turn-forecast.view";
import type { TurnPanelActivityView } from "@/modules/turns/application/dto/turn-panel-activity.view";
import type { TurnPanelGigView } from "@/modules/turns/application/dto/turn-panel-gig.view";
import type { TurnPanelStudioView } from "@/modules/turns/application/dto/turn-panel-studio.view";
import type { TurnPendingItemView } from "@/modules/turns/application/dto/turn-pending-item.view";

/** Everything the turn screen needs in one read (ADR-0022). */
export class TurnPanelView {
  /** The band's live year. */
  year: number;
  /** The live year formatted as a period. */
  period: string;
  /** Expected stage performance now, `0..1`. */
  performance: number;
  /** What is waiting on the player; blocking items stop the advance. */
  pending: TurnPendingItemView[];
  gig: TurnPanelGigView;
  activity: TurnPanelActivityView;
  studio: TurnPanelStudioView;
  /** What the next advance would do to the cash. */
  forecast: TurnForecastView;
}
