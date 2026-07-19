import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { UpdateBandMemberUseCase } from "@/modules/band-members/application/use-cases/update-band-member.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("UpdateBandMemberUseCase", () => {
  let useCase: UpdateBandMemberUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { update: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { update: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateBandMemberUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(UpdateBandMemberUseCase);
  });

  it("applies the changes and returns the updated member", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.update.mockResolvedValue(
      new BandMemberEntity(
        "m-1",
        BAND_ID,
        "Novo Nome",
        25,
        "male",
        1,
        ["creative"],
        { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
        "nova bio",
        "guitar",
        null,
        new Date(),
        new Date(),
      ),
    );

    const result = await useCase.execute(actor, BAND_ID, "m-1", {
      name: "Novo Nome",
    });
    expect(result).toMatchObject({ name: "Novo Nome", age: 25 });
    expect(membersRepository.update).toHaveBeenCalledWith("m-1", BAND_ID, {
      name: "Novo Nome",
    });
  });

  it("throws NotFound when the member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.update.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, BAND_ID, "m-x", { name: "X" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
