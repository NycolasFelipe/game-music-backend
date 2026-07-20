import { Injectable } from "@nestjs/common";
import {
  generateReleaseTitles,
  type GenerateTitleOptions,
} from "@/modules/releases/domain/generation/release-title.generator";

/** Input for title generation: options plus how many to produce. */
export interface GenerateReleaseTitlesInput extends GenerateTitleOptions {
  count?: number;
}

/** Result of generating release titles. */
export interface GeneratedReleaseTitles {
  titles: string[];
}

/**
 * Generates random release-title suggestions. Stateless — does not persist
 * anything nor require the actor.
 */
@Injectable()
export class GenerateReleaseTitleUseCase {
  /**
   * Produces title suggestions for the given options.
   *
   * @param input - Language options and the desired count.
   * @returns The generated title suggestions.
   */
  execute(input: GenerateReleaseTitlesInput = {}): GeneratedReleaseTitles {
    const { count = 6, ...options } = input;
    return { titles: generateReleaseTitles(count, options) };
  }
}
