import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { toBandMemberView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Fetches a single member of a band owned by the actor.
 */
@Injectable()
export class GetBandMemberUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Verifies band ownership and returns the requested member.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @returns The member as a public view.
   * @throws {NotFoundException} When the band or member is not found.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    memberId: string,
  ): Promise<BandMemberView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const member = await this.bandMembersRepository.findByIdAndBandId(
      memberId,
      bandId,
    );
    if (!member) {
      throw new NotFoundException("Member not found");
    }

    return toBandMemberView(member, band.fanCount);
  }
}
