import { Test } from "@nestjs/testing";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { AutoAdjustSalariesUseCase } from "@/modules/band-members/application/use-cases/auto-adjust-salaries.use-case";
import { targetSalary } from "@/modules/band-members/domain/salary/salary.calculator";

const skills = (value: number): Skills => ({
  vocal: value,
  guitar: value,
  bass: value,
  drums: value,
  piano: value,
  lyrics: value,
});

/** A member whose target salary is above the salary they currently earn. */
const underpaid = (id: string, name: string) => ({
  id,
  name,
  skills: skills(6),
  characteristics: [],
  salary: 10,
});

describe("AutoAdjustSalariesUseCase", () => {
  let useCase: AutoAdjustSalariesUseCase;
  let repository: { findByBandId: jest.Mock; setSalary: jest.Mock };

  const target = targetSalary(skills(6), [], 0);

  beforeEach(async () => {
    repository = {
      findByBandId: jest.fn().mockResolvedValue([underpaid("m-1", "Ana")]),
      setSalary: jest.fn().mockResolvedValue({}),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AutoAdjustSalariesUseCase,
        { provide: BAND_MEMBERS_REPOSITORY, useValue: repository },
      ],
    }).compile();
    useCase = moduleRef.get(AutoAdjustSalariesUseCase);
  });

  it("raises underpaid members to their target and logs the agreement", async () => {
    const raises = await useCase.execute("band-1", 0, 100_000, 2003.5);

    expect(raises).toEqual([
      { memberId: "m-1", name: "Ana", from: 10, to: target },
    ]);
    expect(repository.setSalary).toHaveBeenCalledWith("m-1", "band-1", {
      amount: target,
      effectiveYear: 2003.5,
      reason: "automatico",
    });
  });

  it("applies nothing when the cash cannot cover the new payroll", async () => {
    const raises = await useCase.execute("band-1", 0, 1, 2003.5);

    expect(raises).toEqual([]);
    expect(repository.setSalary).not.toHaveBeenCalled();
  });

  it("does nothing when every member is already at or above target", async () => {
    repository.findByBandId.mockResolvedValue([
      { ...underpaid("m-1", "Ana"), salary: target + 100 },
    ]);

    const raises = await useCase.execute("band-1", 0, 100_000, 2003.5);

    expect(raises).toEqual([]);
    expect(repository.setSalary).not.toHaveBeenCalled();
  });
});
