import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { SetMemberSalaryUseCase } from "@/modules/band-members/application/use-cases/set-member-salary.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

const memberWithSalary = (salary: number) =>
  new BandMemberEntity(
    "m-1",
    BAND_ID,
    "João",
    24,
    "male",
    "👨🏽",
    1,
    ["creative"],
    { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
    "bio",
    "guitar",
    null,
    salary,
    0,
    new Date(),
    new Date(),
  );

describe("SetMemberSalaryUseCase", () => {
  let useCase: SetMemberSalaryUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { setSalary: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { setSalary: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        SetMemberSalaryUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(SetMemberSalaryUseCase);
  });

  it("records the new salary effective in the band's current year", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      fanCount: 100,
      currentYear: 2005,
    });
    membersRepository.setSalary.mockResolvedValue(memberWithSalary(500));

    const result = await useCase.execute(actor, BAND_ID, "m-1", {
      amount: 500,
    });

    expect(membersRepository.setSalary).toHaveBeenCalledWith("m-1", BAND_ID, {
      amount: 500,
      effectiveYear: 2005,
      reason: "ajuste",
    });
    expect(result).toMatchObject({ id: "m-1", salary: 500 });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, BAND_ID, "m-1", { amount: 500 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(membersRepository.setSalary).not.toHaveBeenCalled();
  });

  it("throws BadRequest for a negative amount", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      fanCount: 0,
      currentYear: 2005,
    });

    await expect(
      useCase.execute(actor, BAND_ID, "m-1", { amount: -1 }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(membersRepository.setSalary).not.toHaveBeenCalled();
  });

  it("throws NotFound when the member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      fanCount: 0,
      currentYear: 2005,
    });
    membersRepository.setSalary.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, BAND_ID, "m-x", { amount: 500 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
