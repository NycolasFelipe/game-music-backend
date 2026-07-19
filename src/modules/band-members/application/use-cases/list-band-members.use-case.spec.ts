import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListBandMembersUseCase } from "@/modules/band-members/application/use-cases/list-band-members.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("ListBandMembersUseCase", () => {
  let useCase: ListBandMembersUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListBandMembersUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListBandMembersUseCase);
  });

  it("returns the band's members when owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.findByBandId.mockResolvedValue([
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
        new Date(),
        new Date(),
      ),
    ]);

    const result = await useCase.execute(actor, BAND_ID);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "m-1", bandId: BAND_ID });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(membersRepository.findByBandId).not.toHaveBeenCalled();
  });
});
