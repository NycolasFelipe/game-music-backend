import {
  FIRST_TURN_LAST_MONTH,
  MONTH_ABBREVIATIONS,
  MONTH_NAMES,
} from "@/modules/turns/domain/constants/calendar.constant";

/** A calendar date in the game (month and day are 1-based). */
export interface TurnDate {
  year: number;
  month: number;
  day: number;
}

/** How a turn date is written: in full for headlines, short for lists. */
export type TurnDateStyle = "long" | "short";

const DAY_MS = 86_400_000;

/**
 * FNV-1a 32-bit hash of a string. Small, stable and identical to the frontend
 * copy, so both sides pick the same day for the same band and turn.
 *
 * @param text - The text to hash.
 * @returns An unsigned 32-bit hash.
 */
function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Picks the calendar date of a turn (ADR-0033). The first turn of a year falls
 * on a day between January 1 and July 31; the second between August 1 and
 * December 31. The day comes from a hash of the band id and the turn, so the
 * same save always shows the same date and different saves get different
 * calendars, without storing anything.
 *
 * @param bandId - The band (save) id, used as the seed.
 * @param turnYear - The in-game year of the turn (`.5` marks the second turn).
 * @returns The date of that turn.
 */
export function turnDate(bandId: string, turnYear: number): TurnDate {
  const year = Math.floor(turnYear);
  const secondTurn = turnYear - year >= 0.5;
  const start = Date.UTC(year, secondTurn ? FIRST_TURN_LAST_MONTH : 0, 1);
  const end = secondTurn
    ? Date.UTC(year + 1, 0, 1)
    : Date.UTC(year, FIRST_TURN_LAST_MONTH, 1);
  const length = Math.round((end - start) / DAY_MS);
  const offset = fnv1a(`${bandId}|${Math.round(turnYear * 2)}`) % length;
  const date = new Date(start + offset * DAY_MS);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/**
 * Writes a turn date in Portuguese: `"14 de setembro de 1995"` (long) or
 * `"14 set. 1995"` (short). The first day of a month is written `1º`.
 *
 * @param date - The date to write.
 * @param style - `long` for headlines and reports, `short` for lists.
 * @returns The formatted date.
 */
export function formatTurnDate(
  date: TurnDate,
  style: TurnDateStyle = "long",
): string {
  const day = date.day === 1 ? "1º" : String(date.day);
  if (style === "short") {
    return `${day} ${MONTH_ABBREVIATIONS[date.month - 1]} ${date.year}`;
  }
  return `${day} de ${MONTH_NAMES[date.month - 1]} de ${date.year}`;
}
