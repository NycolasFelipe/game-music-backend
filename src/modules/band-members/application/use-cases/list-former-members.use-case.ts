import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { FormerMemberView } from "@/modules/band-members/application/dto/former-member.view";
import { toFormerMemberView } from "@/modules/band-members/application/mappers/former-member.mapper";
import { FORMER_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/former-members.repository";
import type { FormerMembersRepository } from "@/modules/band-members/domain/repositories/former-members.repository";

/**
 * Lists a band's former (departed) members for its owner (ADR-0010).
 */
@Injectable()
export class ListFormerMembersUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(FORMER_MEMBERS_REPOSITORY)
    private readonly formerMembersRepository: FormerMembersRepository,
  ) {}

  /**
   * Verifies band ownership and returns the band's former members.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's former members as public views (newest first).
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<FormerMemberView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const formers = await this.formerMembersRepository.findByBandId(bandId);
    return formers.map(toFormerMemberView);
  }
}
