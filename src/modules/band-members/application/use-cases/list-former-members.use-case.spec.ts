import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListFormerMembersUseCase } from "@/modules/band-members/application/use-cases/list-former-members.use-case";
import { FormerMemberEntity } from "@/modules/band-members/domain/entities/former-member.entity";
import { FORMER_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/former-members.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

const former = new FormerMemberEntity(
  "fm-1",
  BAND_ID,
  "m-1",
  "Ana",
  24,
  "male",
  "👨",
  1,
  ["greedy"],
  { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
  "bio",
  "guitar",
  2000,
  300,
  3,
  "salario_atrasado",
  2004,
  [{ memberName: "Beto", level: 3 }],
  new Date(),
);

describe("ListFormerMembersUseCase", () => {
  let useCase: ListFormerMembersUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let formerMembersRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    formerMembersRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListFormerMembersUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: FORMER_MEMBERS_REPOSITORY,
          useValue: formerMembersRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(ListFormerMembersUseCase);
  });

  it("returns the band's former members as views", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    formerMembersRepository.findByBandId.mockResolvedValue([former]);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: "Ana",
      reason: "salario_atrasado",
      leftAtYear: 2004,
      unpaidTurns: 3,
    });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);

    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(formerMembersRepository.findByBandId).not.toHaveBeenCalled();
  });
});
