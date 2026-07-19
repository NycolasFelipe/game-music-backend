import { Injectable } from "@nestjs/common";
import { generateBandName } from "@/modules/bands/domain/generation/band-name.generator";

/** Result of generating a band name. */
export interface GeneratedBandName {
  name: string;
}

/**
 * Generates a random suggested band name. Stateless — does not persist
 * anything nor require the actor.
 */
@Injectable()
export class GenerateBandNameUseCase {
  /**
   * Produces a random band name suggestion.
   *
   * @returns An object carrying the generated name.
   */
  execute(): GeneratedBandName {
    return { name: generateBandName() };
  }
}
