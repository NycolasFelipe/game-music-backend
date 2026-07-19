import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GetBandMemberUseCase } from "@/modules/band-members/application/use-cases/get-band-member.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

const member = new BandMemberEntity(
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
);

describe("GetBandMemberUseCase", () => {
  let useCase: GetBandMemberUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let membersRepository: { findByIdAndBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    membersRepository = { findByIdAndBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetBandMemberUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GetBandMemberUseCase);
  });

  it("returns the member when the band and member exist for the owner", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.findByIdAndBandId.mockResolvedValue(member);

    const result = await useCase.execute(actor, BAND_ID, "m-1");
    expect(result).toMatchObject({ id: "m-1", bandId: BAND_ID });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID, "m-1")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("throws NotFound when the member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    membersRepository.findByIdAndBandId.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID, "m-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
