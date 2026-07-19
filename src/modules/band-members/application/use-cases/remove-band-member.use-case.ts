import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Removes a member from a band owned by the actor.
 */
@Injectable()
export class RemoveBandMemberUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Verifies band ownership and removes the member.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @returns A promise that resolves once the member is removed.
   * @throws {NotFoundException} When the band or member is not found.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    memberId: string,
  ): Promise<void> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const removed = await this.bandMembersRepository.deleteByIdAndBandId(
      memberId,
      bandId,
    );
    if (!removed) {
      throw new NotFoundException("Member not found");
    }
  }
}
