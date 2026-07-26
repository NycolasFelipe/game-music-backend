import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  computeAutoRaises,
  targetSalary,
  type AutoRaise,
  type AutoRaiseMemberInput,
} from "@/modules/band-members/domain/salary/salary.calculator";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Raises salaries to their target on a turn, for saves with the automatic
 * adjustment enabled (ADR-0013). Never cuts a salary, and only applies when the
 * turn's cash covers the resulting payroll — so it can never cause arrears.
 * Called by the turn tick between the royalties and the payroll.
 */
@Injectable()
export class AutoAdjustSalariesUseCase {
  private readonly logger = new Logger(AutoAdjustSalariesUseCase.name);

  constructor(
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Computes and persists this turn's automatic raises.
   *
   * @param bandId - The band id.
   * @param fanCount - The band's fan count (drives the salary target).
   * @param availableCash - The cash available this turn (balance + royalties).
   * @param effectiveYear - The band's year, recorded on each new agreement.
   * @returns The raises applied (empty when none, or when cash fell short).
   */
  async execute(
    bandId: string,
    fanCount: number,
    availableCash: number,
    effectiveYear: number,
  ): Promise<AutoRaise[]> {
    const members = await this.bandMembersRepository.findByBandId(bandId);
    const inputs: AutoRaiseMemberInput[] = members.map((member) => ({
      memberId: member.id,
      name: member.name,
      salary: member.salary,
      target: targetSalary(member.skills, member.characteristics, fanCount),
    }));

    const { raises, applied, payrollProposed } = computeAutoRaises(
      inputs,
      availableCash,
    );
    if (!applied) {
      if (raises.length > 0) {
        this.logger.log(
          `Band ${bandId}: automatic raises skipped — payroll ${payrollProposed} exceeds the ${availableCash} available.`,
        );
      }
      return [];
    }

    for (const raise of raises) {
      await this.bandMembersRepository.setSalary(raise.memberId, bandId, {
        amount: raise.to,
        effectiveYear,
        reason: "automatico",
      });
    }

    this.logger.log(
      `Band ${bandId}: ${raises.length} salary(ies) raised automatically.`,
    );
    return raises;
  }
}
