import type { TurnPanelStudioReleaseView } from "@/modules/turns/application/dto/turn-panel-studio-release.view";

/** The studio slot of the turn (ADR-0022). */
export class TurnPanelStudioView {
  /** The work in creation, or `null` when the studio is free. */
  release: TurnPanelStudioReleaseView | null;
  /** Works launched in the current calendar year. */
  launchesThisYear: number;
  /** Market saturation factor the next launch would get (ADR-0015 §5). */
  nextMarketMultiplier: number;
}
