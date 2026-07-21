import { Test } from "@nestjs/testing";
import { PaySalariesUseCase } from "@/modules/band-members/application/use-cases/pay-salaries.use-case";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const BAND_ID = "band-1";

const member = (
  id: string,
  salary: number,
  happiness: number,
  unpaidTurns: number,
) => ({
  id,
  salary,
  happiness,
  salaryUnpaidTurns: unpaidTurns,
  characteristics: [],
  skills: { vocal: 0, guitar: 0, bass: 0, drums: 0, piano: 0, lyrics: 0 },
});

describe("PaySalariesUseCase", () => {
  let useCase: PaySalariesUseCase;
  let membersRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    membersRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaySalariesUseCase,
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(PaySalariesUseCase);
  });

  it("pays members from the available cash and marks the unpaid", async () => {
    // With zero skills, no traits and 0 fans, each target is the base (250).
    membersRepository.findByBandId.mockResolvedValue([
      member("m-1", 250, 0, 0),
      member("m-2", 400, 0, 0),
    ]);

    const result = await useCase.execute(BAND_ID, 0, 250);

    expect(result.totalDue).toBe(650);
    expect(result.totalPaid).toBe(250);
    expect(result.fullyPaid).toBe(false);
    expect(result.outcomes[0]).toMatchObject({ memberId: "m-1", paid: true });
    expect(result.outcomes[1]).toMatchObject({
      memberId: "m-2",
      paid: false,
      newUnpaidTurns: 1,
    });
  });

  it("returns an empty payroll for a band with no members", async () => {
    membersRepository.findByBandId.mockResolvedValue([]);

    const result = await useCase.execute(BAND_ID, 0, 1000);

    expect(result).toEqual({
      totalDue: 0,
      totalPaid: 0,
      fullyPaid: true,
      outcomes: [],
    });
  });
});
