import { Injectable } from "@nestjs/common";
import {
  generateReleaseConcept,
  type GenerateConceptOptions,
} from "@/modules/releases/domain/generation/release-concept.generator";

/** Input for concept generation (title/style-label seeds). */
export type GenerateReleaseConceptInput = GenerateConceptOptions;

/** Result of generating a release concept. */
export interface GeneratedReleaseConcept {
  concept: string;
}

/**
 * Generates a concept-album description. Stateless — does not persist anything
 * nor require the actor.
 */
@Injectable()
export class GenerateReleaseConceptUseCase {
  /**
   * Produces a concept description for the given seeds.
   *
   * @param input - Optional title and style-label seeds.
   * @returns The generated concept.
   */
  execute(input: GenerateReleaseConceptInput = {}): GeneratedReleaseConcept {
    return { concept: generateReleaseConcept(input) };
  }
}
