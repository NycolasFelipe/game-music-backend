import { Test } from "@nestjs/testing";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import {
  salaryPatience,
  targetSalary,
} from "@/modules/band-members/domain/salary/salary.calculator";
import { royaltyPayout } from "@/modules/releases/domain/quality/release.calculator";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import { ForecastTurnUseCase } from "@/modules/turns/application/use-cases/forecast-turn.use-case";

const BAND_ID = "band-1";

const skills = (value: number): Skills => ({
  vocal: value,
  guitar: value,
  bass: value,
  drums: value,
  piano: value,
  lyrics: value,
});

const member = (
  id: string,
  salary: number,
  extra: Partial<BandMemberEntity> = {},
): BandMemberEntity =>
  ({
    id,
    name: `Member ${id}`,
    skills: skills(3),
    characteristics: [],
    happiness: 0,
    salary,
    salaryUnpaidTurns: 0,
    ...extra,
  }) as BandMemberEntity;

describe("ForecastTurnUseCase", () => {
  let useCase: ForecastTurnUseCase;
  let releasesRepository: { findActiveRoyaltyReleases: jest.Mock };

  beforeEach(async () => {
    releasesRepository = {
      findActiveRoyaltyReleases: jest.fn().mockResolvedValue([]),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ForecastTurnUseCase,
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ForecastTurnUseCase);
  });

  it("adds the royalties of each earning release and pays the payroll", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      {
        id: "r1",
        title: "Primeiro",
        royaltyRemaining: 1000,
        royaltyTurnsLeft: 4,
      },
      { id: "r2", title: "Último", royaltyRemaining: 300, royaltyTurnsLeft: 1 },
    ]);
    const r1 = royaltyPayout(1000, 4);
    const r2 = royaltyPayout(300, 1);

    const result = await useCase.execute({
      bandId: BAND_ID,
      balance: 1000,
      fanCount: 100,
      autoSalaryAdjust: false,
      members: [member("m1", 100), member("m2", 150)],
    });

    expect(releasesRepository.findActiveRoyaltyReleases).toHaveBeenCalledWith(
      BAND_ID,
    );
    expect(result.royaltyPayouts).toEqual([
      {
        releaseId: "r1",
        title: "Primeiro",
        amount: r1,
        turnsLeft: 3,
        remaining: Math.round((1000 - r1) * 100) / 100,
      },
      {
        releaseId: "r2",
        title: "Último",
        amount: r2,
        turnsLeft: 0,
        remaining: 0,
      },
    ]);
    expect(result.royalties).toBeCloseTo(r1 + r2, 2);
    expect(result.salaryRaises).toBe(0);
    expect(result.payroll).toBe(250);
    expect(result.balanceAfter).toBeCloseTo(1000 + r1 + r2 - 250, 2);
    expect(result.atRiskMemberIds).toEqual([]);
    expect(result.departingMemberIds).toEqual([]);
  });

  it("applies the automatic raises when the save has them and the cash covers them", async () => {
    const m1 = member("m1", 1);
    const target = targetSalary(m1.skills, m1.characteristics, 100);

    const result = await useCase.execute({
      bandId: BAND_ID,
      balance: 100000,
      fanCount: 100,
      autoSalaryAdjust: true,
      members: [m1],
    });

    expect(result.salaryRaises).toBe(target - 1);
    expect(result.payroll).toBe(target);
    expect(result.balanceAfter).toBe(100000 - target);
  });

  it("skips the raises when the save does not adjust salaries", async () => {
    const result = await useCase.execute({
      bandId: BAND_ID,
      balance: 100000,
      fanCount: 100,
      autoSalaryAdjust: false,
      members: [member("m1", 1)],
    });

    expect(result.salaryRaises).toBe(0);
    expect(result.payroll).toBe(1);
  });

  it("skips the raises when the cash does not cover the new payroll", async () => {
    const result = await useCase.execute({
      bandId: BAND_ID,
      balance: 2,
      fanCount: 100,
      autoSalaryAdjust: true,
      members: [member("m1", 1)],
    });

    expect(result.salaryRaises).toBe(0);
    expect(result.payroll).toBe(1);
    expect(result.balanceAfter).toBe(1);
  });

  it("pays only who the cash covers and flags arrears and departures", async () => {
    const patience = salaryPatience([]);

    const result = await useCase.execute({
      bandId: BAND_ID,
      balance: 120,
      fanCount: 100,
      autoSalaryAdjust: false,
      members: [
        member("paid", 100),
        member("late", 100),
        member("leaving", 100, { salaryUnpaidTurns: patience - 1 }),
      ],
    });

    expect(result.payroll).toBe(300);
    expect(result.balanceAfter).toBe(20);
    expect(result.atRiskMemberIds).toEqual(["late"]);
    expect(result.departingMemberIds).toEqual(["leaving"]);
  });
});
