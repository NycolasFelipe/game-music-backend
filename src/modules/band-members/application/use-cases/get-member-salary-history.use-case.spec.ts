import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GetMemberSalaryHistoryUseCase } from "@/modules/band-members/application/use-cases/get-member-salary-history.use-case";
import { SalaryAgreementEntity } from "@/modules/band-members/domain/entities/salary-agreement.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("GetMemberSalaryHistoryUseCase", () => {
  let useCase: GetMemberSalaryHistoryUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: {
    findByIdAndBandId: jest.Mock;
    findSalaryHistory: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = {
      findByIdAndBandId: jest.fn(),
      findSalaryHistory: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetMemberSalaryHistoryUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GetMemberSalaryHistoryUseCase);
  });

  it("returns the member's salary agreements as views", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.findByIdAndBandId.mockResolvedValue({ id: "m-1" });
    membersRepository.findSalaryHistory.mockResolvedValue([
      new SalaryAgreementEntity(
        "s-1",
        "m-1",
        BAND_ID,
        500,
        2005,
        "ajuste",
        new Date("2005-01-01"),
      ),
    ]);

    const result = await useCase.execute(actor, BAND_ID, "m-1");

    expect(result).toEqual([
      {
        amount: 500,
        effectiveYear: 2005,
        reason: "ajuste",
        createdAt: new Date("2005-01-01"),
      },
    ]);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);

    await expect(useCase.execute(actor, BAND_ID, "m-1")).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(membersRepository.findSalaryHistory).not.toHaveBeenCalled();
  });

  it("throws NotFound when the member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.findByIdAndBandId.mockResolvedValue(null);

    await expect(useCase.execute(actor, BAND_ID, "m-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(membersRepository.findSalaryHistory).not.toHaveBeenCalled();
  });
});
