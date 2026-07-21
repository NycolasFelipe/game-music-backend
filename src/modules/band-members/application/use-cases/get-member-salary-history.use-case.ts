import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { SalaryAgreementView } from "@/modules/band-members/application/dto/salary-agreement.view";
import { toSalaryAgreementView } from "@/modules/band-members/application/mappers/salary.mapper";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Lists a member's salary history (ADR-0010 §7), newest first.
 */
@Injectable()
export class GetMemberSalaryHistoryUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Verifies band ownership and the member's existence, then returns the
   * member's salary agreements.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @returns The member's salary agreements as public views.
   * @throws {NotFoundException} When the band or member is not found.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    memberId: string,
  ): Promise<SalaryAgreementView[]> {
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

    const history = await this.bandMembersRepository.findSalaryHistory(
      memberId,
      bandId,
    );
    return history.map(toSalaryAgreementView);
  }
}
