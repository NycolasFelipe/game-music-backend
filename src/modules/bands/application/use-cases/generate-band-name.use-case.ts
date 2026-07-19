import { Injectable } from "@nestjs/common";
import {
  generateBandNames,
  type GenerateNameOptions,
} from "@/modules/bands/domain/generation/band-name.generator";

/** Input for band-name generation: options plus how many to produce. */
export interface GenerateBandNamesInput extends GenerateNameOptions {
  count?: number;
}

/** Result of generating band names. */
export interface GeneratedBandNames {
  names: string[];
}

/**
 * Generates random band name suggestions. Stateless — does not persist anything
 * nor require the actor.
 */
@Injectable()
export class GenerateBandNameUseCase {
  /**
   * Produces band name suggestions for the given options.
   *
   * @param input - Language/article/genre options and the desired count.
   * @returns The generated name suggestions.
   */
  execute(input: GenerateBandNamesInput = {}): GeneratedBandNames {
    const { count = 1, ...options } = input;
    return { names: generateBandNames(count, options) };
  }
}
