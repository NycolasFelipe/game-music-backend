/**
 * Calendar rules for turn dates (ADR-0033). Each year has two turns: the first
 * falls on some day from January 1 to July 31, the second from August 1 to
 * December 31, so dates always move forward.
 */

/** Last month (1-based) of the first turn of a year. */
export const FIRST_TURN_LAST_MONTH = 7;

/** Full month names, as written in a long date (index 0 = January). */
export const MONTH_NAMES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

/** Abbreviated month names, as written in a short date (index 0 = January). */
export const MONTH_ABBREVIATIONS = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "maio",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
] as const;
