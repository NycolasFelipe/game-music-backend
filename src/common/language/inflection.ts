/**
 * Inflection helpers shared by the text generators: drawing the number of a
 * noun phrase and picking the noun or adjective form that agrees with it.
 */
import type {
  Gender,
  GrammaticalNumber,
  RomanceAdjective,
} from "@/common/language/lexicon";
import { chance } from "@/common/language/random-pick";

/** Anything with a singular and an optional plural form. */
export interface Inflectable {
  readonly sg: string;
  readonly pl: string | null;
}

/**
 * Draws the number of a noun phrase, respecting nouns without plural.
 *
 * @param noun - Head noun.
 * @param pluralChance - Probability of plural when the noun has one.
 * @returns "sg" or "pl".
 */
export function drawNumber(
  noun: Inflectable,
  pluralChance: number,
): GrammaticalNumber {
  return noun.pl !== null && chance(pluralChance) ? "pl" : "sg";
}

/**
 * Returns the noun form for a number (the singular when there is no plural).
 *
 * @param noun - The noun.
 * @param number - Desired number.
 * @returns Singular or plural form.
 */
export function nounForm(noun: Inflectable, number: GrammaticalNumber): string {
  return number === "pl" && noun.pl !== null ? noun.pl : noun.sg;
}

/**
 * Returns the adjective form agreeing with a noun's gender and number.
 *
 * @param adjective - The adjective.
 * @param gender - Gender of the noun.
 * @param number - Number of the noun phrase.
 * @returns The agreeing form ("Elétricas" for a feminine plural).
 */
export function adjectiveForm(
  adjective: RomanceAdjective,
  gender: Gender,
  number: GrammaticalNumber,
): string {
  if (gender === "m") {
    return number === "sg" ? adjective.ms : adjective.mp;
  }
  return number === "sg" ? adjective.fs : adjective.fp;
}
