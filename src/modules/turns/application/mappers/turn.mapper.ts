import { TurnView } from "@/modules/turns/application/dto/turn.view";
import type { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";

/**
 * Formats a half-year value as a readable period. Whole years are the first
 * semester; `.5` fractions are the second.
 *
 * @param year - The (possibly fractional) in-game year.
 * @returns A label like `"2003 - 1º semestre"` / `"2003 - 2º semestre"`.
 */
export function formatPeriod(year: number): string {
  const calendarYear = Math.floor(year);
  const isSecondSemester = year % 1 !== 0;
  return `${calendarYear} - ${isSecondSemester ? "2º" : "1º"} semestre`;
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
    period: formatPeriod(turn.year),
    fanCount: turn.fanCountSnapshot,
    balance: turn.balanceSnapshot,
    happinessAvg: turn.happinessAvgSnapshot,
    relationshipAvg: turn.relationshipAvgSnapshot,
    passiveEventId: turn.passiveEventId,
    activeEventId: turn.activeEventId,
    createdAt: turn.createdAt,
  };
}
