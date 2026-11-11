/**
 * Random draws shared by the text generators. All of them go through
 * `Math.random()`, so a test can seed it and get repeatable output.
 */

/**
 * Picks a random element from a non-empty array.
 *
 * @param array - Candidates.
 * @returns One of them, uniformly.
 */
export function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Picks a random element whose key differs from every excluded key, so a
 * phrase never repeats a word ("Abismo do Abismo"). Falls back to the full
 * list if the exclusion empties it.
 *
 * @param array - Candidates.
 * @param key - Extracts the comparable word of a candidate.
 * @param excluded - Words already used in the phrase.
 * @returns A candidate not yet used.
 */
export function pickOther<T>(
  array: readonly T[],
  key: (item: T) => string,
  excluded: readonly string[],
): T {
  const remaining = array.filter((item) => !excluded.includes(key(item)));
  return pick(remaining.length > 0 ? remaining : array);
}

/**
 * Draws `true` with the given probability.
 *
 * @param probability - Value between 0 and 1.
 * @returns Whether the draw succeeded.
 */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}
