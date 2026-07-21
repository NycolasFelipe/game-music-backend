import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { toBandMemberView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { SetMemberSalaryInput } from "@/modules/band-members/application/dto/set-member-salary.input";
import {
  SALARY_MAX,
  SALARY_MIN,
} from "@/modules/band-members/domain/constants/salary.constant";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Adjusts a member's salary (ADR-0010 §7). Records a new agreement (current
 * salary + history) effective in the band's current year.
 */
@Injectable()
export class SetMemberSalaryUseCase {
  private readonly logger = new Logger(SetMemberSalaryUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Verifies band ownership, validates the amount and records the new salary.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @param input - The new salary amount.
   * @returns The updated member as a public view.
   * @throws {NotFoundException} When the band or member is not found.
   * @throws {BadRequestException} When the amount is outside the allowed range.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    memberId: string,
    input: SetMemberSalaryInput,
  ): Promise<BandMemberView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    if (input.amount < SALARY_MIN || input.amount > SALARY_MAX) {
      throw new BadRequestException(
        `Salary must be between ${SALARY_MIN} and ${SALARY_MAX}.`,
      );
    }

    const member = await this.bandMembersRepository.setSalary(
      memberId,
      bandId,
      {
        amount: input.amount,
        effectiveYear: band.currentYear,
        reason: "ajuste",
      },
    );
    if (!member) {
      throw new NotFoundException("Member not found");
    }

    this.logger.log(
      `Member ${memberId} salary set to ${input.amount} in band ${bandId}`,
    );

    return toBandMemberView(member, band.fanCount);
  }
}
