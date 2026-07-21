import { Inject, Injectable } from "@nestjs/common";
import {
  computePayroll,
  salaryPatience,
  targetSalary,
  type PayrollMemberInput,
  type PayrollResult,
} from "@/modules/band-members/domain/salary/salary.calculator";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Runs a band's salary payroll for a turn (ADR-0010 §4-6). Loads the members,
 * derives each target, and computes who gets paid from the available cash, the
 * happiness reaction and any departures. Called by the turn tick — the caller
 * applies the resulting balance, happiness, arrears and removals atomically.
 */
@Injectable()
export class PaySalariesUseCase {
  constructor(
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
  ) {}

  /**
   * Computes the payroll for a band's turn without mutating state.
   *
   * @param bandId - The band id.
   * @param fanCount - The band's current fan count (drives the salary target).
   * @param availableCash - The cash available to pay salaries this turn.
   * @returns The payroll result (totals plus per-member outcomes).
   */
  async execute(
    bandId: string,
    fanCount: number,
    availableCash: number,
  ): Promise<PayrollResult> {
    const members = await this.bandMembersRepository.findByBandId(bandId);
    const inputs: PayrollMemberInput[] = members.map((member) => ({
      memberId: member.id,
      name: member.name,
      salary: member.salary,
      target: targetSalary(member.skills, member.characteristics, fanCount),
      happiness: member.happiness,
      unpaidTurns: member.salaryUnpaidTurns,
      patience: salaryPatience(member.characteristics),
    }));

    return computePayroll(inputs, availableCash);
  }
}
