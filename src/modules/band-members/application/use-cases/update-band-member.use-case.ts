import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { toBandMemberView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { UpdateBandMemberInput } from "@/modules/band-members/application/dto/update-band-member.input";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Updates a member's editable fields (name/age/biography) within a band owned
 * by the actor.
 */
@Injectable()
export class UpdateBandMemberUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Verifies band ownership and applies the editable changes to the member.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @param changes - The editable fields to apply.
   * @returns The updated member as a public view.
   * @throws {NotFoundException} When the band or member is not found.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    memberId: string,
    changes: UpdateBandMemberInput,
  ): Promise<BandMemberView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const member = await this.bandMembersRepository.update(
      memberId,
      bandId,
      changes,
    );
    if (!member) {
      throw new NotFoundException("Member not found");
    }

    return toBandMemberView(member);
  }
}
