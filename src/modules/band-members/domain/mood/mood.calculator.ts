import {
  HAPPINESS_MAX,
  HAPPINESS_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  DEPARTURE_FAN_LOSS,
  MOOD_DEPARTURE_THRESHOLD,
  MOOD_DEPARTURE_TURNS,
  MOOD_DRIFT_RATE,
} from "@/modules/band-members/domain/constants/mood.constant";

/**
 * Pure mood rules of the turn tick (ADR-0032): the drift of happiness back to
 * neutral, the departure of members kept in a bad mood, and the fans a band
 * loses when someone leaves. Shared by the tick and the turn forecast, so the
 * forecast stays exact.
 */

/** Rounds to two decimals (happiness precision used across the domain). */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** One member's mood inputs for a turn advance. */
export interface MoodTickMemberInput {
  memberId: string;
  /** Happiness after this advance's payroll. */
  happiness: number;
  /** Consecutive advances that already ended in a bad mood. */
  lowMoodTurns: number;
}

/** One member's mood outcome for a turn advance. */
export interface MoodTickMemberOutcome {
  memberId: string;
  /** Happiness after drifting toward neutral (clamped). */
  newHappiness: number;
  /** Updated bad-mood counter (0 once the mood is above the threshold). */
  newLowMoodTurns: number;
  /** Whether the member leaves the band on this advance. */
  departed: boolean;
  /**
   * Whether the member is in a bad mood and would leave on the next advance if
   * it does not improve.
   */
  atRisk: boolean;
}

/**
 * Moves a happiness value a fixed fraction of the way back to neutral.
 *
 * @param happiness - The current happiness (-5..5).
 * @returns The drifted happiness, rounded to two decimals and clamped.
 */
export function driftedHappiness(happiness: number): number {
  const drifted = round2(happiness * (1 - MOOD_DRIFT_RATE));
  return Math.max(HAPPINESS_MIN, Math.min(HAPPINESS_MAX, drifted));
}

/**
 * Applies the end-of-advance mood rules to each member: the happiness drifts
 * toward neutral, a member at or below the threshold counts one more bad turn,
 * and whoever reaches the limit leaves (ADR-0032 §2 and §5).
 *
 * @param members - The members still in the band after the payroll.
 * @returns One outcome per member, in the same order.
 */
export function computeMoodTick(
  members: MoodTickMemberInput[],
): MoodTickMemberOutcome[] {
  return members.map((member) => {
    const newHappiness = driftedHappiness(member.happiness);
    const low = newHappiness <= MOOD_DEPARTURE_THRESHOLD;
    const newLowMoodTurns = low ? member.lowMoodTurns + 1 : 0;
    const departed = newLowMoodTurns >= MOOD_DEPARTURE_TURNS;
    return {
      memberId: member.memberId,
      newHappiness,
      newLowMoodTurns,
      departed,
      atRisk: low && !departed,
    };
  });
}

/**
 * Computes the fans left after members leave: each departure costs a fixed
 * share of the fans, compounding (ADR-0032 §5).
 *
 * @param fanCount - The fans before the departures.
 * @param departures - How many members leave on this advance.
 * @returns The new fan count, never below 1. A band with no departures, or
 *   with one fan or none, keeps its count.
 */
export function fansAfterDepartures(
  fanCount: number,
  departures: number,
): number {
  if (departures <= 0 || fanCount <= 1) {
    return fanCount;
  }
  const kept = fanCount * Math.pow(1 - DEPARTURE_FAN_LOSS, departures);
  return Math.max(1, Math.round(kept));
}
