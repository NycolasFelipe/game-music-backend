/** The work in the studio, as the turn panel shows it (ADR-0022). */
export class TurnPanelStudioReleaseView {
  id: string;
  title: string;
  /** Release format id. */
  format: string;
  /** Production turns still to run (ADR-0015). */
  turnsLeft: number;
  /** Whether it can be launched now (production over, no session pending). */
  ready: boolean;
}
