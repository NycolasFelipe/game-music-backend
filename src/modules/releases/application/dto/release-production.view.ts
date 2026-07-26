/**
 * How the band's work in progress moved during a turn (ADR-0015 §1/§3).
 */
export class ReleaseProductionView {
  releaseId: string;
  /** The work's title, so the turn summary reads without another lookup. */
  title: string;
  /** Turns of production still to run after this one. */
  turnsLeft: number;
  /** Whether the work finished production and can now be launched. */
  ready: boolean;
  /** Whether this turn brought up a new studio decision. */
  newSession: boolean;
}
