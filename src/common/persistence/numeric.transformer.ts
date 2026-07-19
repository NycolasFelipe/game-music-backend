import { ValueTransformer } from "typeorm";

/**
 * TypeORM transformer for `numeric`/`decimal` columns. Postgres returns those
 * as strings via the driver; this converts them to JS numbers on read and
 * leaves values untouched on write.
 */
export const numericTransformer: ValueTransformer = {
  /**
   * Passes the value through on write.
   *
   * @param value - The number (or null) being persisted.
   * @returns The same value.
   */
  to: (value: number | null): number | null => value,

  /**
   * Parses the string returned by the driver into a number.
   *
   * @param value - The raw value from the database (string or null).
   * @returns The parsed number, or `null` when absent.
   */
  from: (value: string | null): number | null =>
    value === null ? null : Number(value),
};
