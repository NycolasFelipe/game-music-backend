import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandWithMembersView } from "@/modules/bands/application/dto/band-with-members.view";
import { toBandWithMembersView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Fetches a single band (with its members) owned by the actor.
 */
@Injectable()
export class GetBandUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
  ) {}

  /**
   * Returns the band with its members, scoped to the authenticated owner.
   *
   * @param actor - The authenticated user requesting the band.
   * @param bandId - The band id.
   * @returns The band composed with its members.
   * @throws {NotFoundException} When the band does not exist for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<BandWithMembersView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );

    if (!composed) {
      throw new NotFoundException("Band not found");
    }

    return toBandWithMembersView(composed);
  }
}
