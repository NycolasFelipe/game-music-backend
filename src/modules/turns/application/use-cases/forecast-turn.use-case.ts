import { Inject, Injectable } from "@nestjs/common";
import type { ForecastTurnInput } from "@/modules/turns/application/dto/forecast-turn.input";
import type { TurnForecastView } from "@/modules/turns/application/dto/turn-forecast.view";
import type { RoyaltyPayoutView } from "@/modules/releases/application/dto/royalty-payout.view";
import {
  computeAutoRaises,
  computePayroll,
  salaryPatience,
  targetSalary,
} from "@/modules/band-members/domain/salary/salary.calculator";
import { royaltyPayout } from "@/modules/releases/domain/quality/release.calculator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/** Rounds to two decimals (money precision). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Simulates the money side of the next turn advance without writing anything
 * (ADR-0022): royalties, automatic raises and payroll, in the same order and
 * with the same pure functions the tick uses
 * ({@link AccrueReleaseRoyaltiesUseCase}, {@link AutoAdjustSalariesUseCase},
 * {@link PaySalariesUseCase}).
 */
@Injectable()
export class ForecastTurnUseCase {
  constructor(
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Forecasts what the next advance would do to the band's cash.
   *
   * Flow: sums the royalty payout of each release still earning; with the cash
   * plus royalties, applies the automatic raises when the save has them on and
   * the cash covers the new payroll; then runs the payroll on that cash, which
   * pays only who it can and marks arrears and departures like the tick does.
   *
   * @param input - The band id, cash, fans, auto-adjust flag and members.
   * @returns The forecast: royalties, raises, payroll, final cash and who
   *   would be left unpaid or leave.
   */
  async execute(input: ForecastTurnInput): Promise<TurnForecastView> {
    const releases = await this.releasesRepository.findActiveRoyaltyReleases(
      input.bandId,
    );
    const royaltyPayouts: RoyaltyPayoutView[] = [];
    let credited = 0;
    for (const release of releases) {
      const amount = royaltyPayout(
        release.royaltyRemaining,
        release.royaltyTurnsLeft,
      );
      if (amount <= 0) {
        continue;
      }
      credited += amount;
      royaltyPayouts.push({
        releaseId: release.id,
        title: release.title,
        amount,
        turnsLeft: Math.max(0, release.royaltyTurnsLeft - 1),
        remaining: Math.max(0, round2(release.royaltyRemaining - amount)),
      });
    }
    const royalties = round2(credited);
    const cashBeforePayroll = round2(input.balance + royalties);

    const targets = new Map(
      input.members.map((member) => [
        member.id,
        targetSalary(member.skills, member.characteristics, input.fanCount),
      ]),
    );

    const raised = new Map<string, number>();
    if (input.autoSalaryAdjust) {
      const auto = computeAutoRaises(
        input.members.map((member) => ({
          memberId: member.id,
          name: member.name,
          salary: member.salary,
          target: targets.get(member.id) ?? member.salary,
        })),
        cashBeforePayroll,
      );
      if (auto.applied) {
        for (const raise of auto.raises) {
          raised.set(raise.memberId, raise.to);
        }
      }
    }
    const salaryRaises = round2(
      input.members.reduce(
        (sum, member) =>
          sum + ((raised.get(member.id) ?? member.salary) - member.salary),
        0,
      ),
    );

    const payroll = computePayroll(
      input.members.map((member) => ({
        memberId: member.id,
        name: member.name,
        salary: raised.get(member.id) ?? member.salary,
        target: targets.get(member.id) ?? member.salary,
        happiness: member.happiness,
        unpaidTurns: member.salaryUnpaidTurns,
        patience: salaryPatience(member.characteristics),
      })),
      cashBeforePayroll,
    );

    return {
      balance: input.balance,
      royalties,
      royaltyPayouts,
      salaryRaises,
      payroll: payroll.totalDue,
      balanceAfter: round2(cashBeforePayroll - payroll.totalPaid),
      atRiskMemberIds: payroll.outcomes
        .filter((outcome) => !outcome.paid && !outcome.departed)
        .map((outcome) => outcome.memberId),
      departingMemberIds: payroll.outcomes
        .filter((outcome) => outcome.departed)
        .map((outcome) => outcome.memberId),
    };
  }
}
