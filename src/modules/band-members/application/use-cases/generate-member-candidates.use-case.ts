import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { BandMemberCandidateView } from "@/modules/band-members/application/dto/band-member-candidate.view";
import {
  CANDIDATES_DEFAULT,
  CANDIDATES_MAX,
  CANDIDATES_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import { generateBandMember } from "@/modules/band-members/domain/generation/character.generator";

/**
 * Generates a batch of member candidates. Stateless — candidates are not
 * persisted; the client picks and later sends the chosen ones back.
 */
@Injectable()
export class GenerateMemberCandidatesUseCase {
  /**
   * Generates member candidates, clamping the requested count to the allowed
   * range.
   *
   * @param count - Desired number of candidates (defaults to the standard
   * count; clamped to the allowed min/max).
   * @returns The generated candidates, each with a temporary id.
   */
  execute(count: number = CANDIDATES_DEFAULT): BandMemberCandidateView[] {
    const clamped = Math.min(Math.max(count, CANDIDATES_MIN), CANDIDATES_MAX);

    return Array.from({ length: clamped }, () => ({
      id: randomUUID(),
      ...generateBandMember(),
    }));
  }
}
