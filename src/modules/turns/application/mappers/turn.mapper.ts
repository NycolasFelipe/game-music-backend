import { TurnView } from "@/modules/turns/application/dto/turn.view";
import {
  formatTurnDate,
  turnDate,
  type TurnDateStyle,
} from "@/modules/turns/domain/calendar/turn-date.calculator";
import type { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";

/**
 * Writes the date of a turn for a band (ADR-0033). The first turn of a year
 * falls between January 1 and July 31 and the second between August 1 and
 * December 31; the day is fixed per band and turn.
 *
 * @param bandId - The band (save) id, which seeds the day.
 * @param year - The (possibly fractional) in-game year of the turn.
 * @param style - `long` (default) or `short`.
 * @returns A label like `"14 de setembro de 1995"`.
 */
export function formatPeriod(
  bandId: string,
  year: number,
  style: TurnDateStyle = "long",
): string {
  return formatTurnDate(turnDate(bandId, year), style);
}

/**
 * Maps a recorded turn domain entity to its public view.
 *
 * @param turn - The turn domain entity.
 * @returns The turn view.
 */
export function toTurnView(turn: TurnEntity): TurnView {
  return {
    year: turn.year,
    period: formatPeriod(turn.bandId, turn.year),
    fanCount: turn.fanCountSnapshot,
    balance: turn.balanceSnapshot,
    happinessAvg: turn.happinessAvgSnapshot,
    relationshipAvg: turn.relationshipAvgSnapshot,
    passiveEventId: turn.passiveEventId,
    activeEventId: turn.activeEventId,
    createdAt: turn.createdAt,
  };
}
