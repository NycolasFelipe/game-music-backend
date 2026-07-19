import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { SetBandRelationshipLevelUseCase } from "@/modules/bands/application/use-cases/set-band-relationship-level.use-case";
import { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("SetBandRelationshipLevelUseCase", () => {
  let useCase: SetBandRelationshipLevelUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let relationshipsRepository: { setLevel: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    relationshipsRepository = { setLevel: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        SetBandRelationshipLevelUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: MEMBER_RELATIONSHIPS_REPOSITORY,
          useValue: relationshipsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(SetBandRelationshipLevelUseCase);
  });

  it("upserts and returns the relationship view", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    relationshipsRepository.setLevel.mockResolvedValue(
      new MemberRelationshipEntity(
        "r-1",
        BAND_ID,
        "a",
        "b",
        4,
        new Date(),
        new Date(),
      ),
    );

    const result = await useCase.execute(actor, BAND_ID, {
      memberId1: "b",
      memberId2: "a",
      level: 4,
    });

    expect(result).toEqual({ memberAId: "a", memberBId: "b", level: 4 });
    expect(relationshipsRepository.setLevel).toHaveBeenCalledWith(
      BAND_ID,
      "b",
      "a",
      4,
    );
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, BAND_ID, {
        memberId1: "a",
        memberId2: "b",
        level: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(relationshipsRepository.setLevel).not.toHaveBeenCalled();
  });

  it("throws NotFound when a member is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    relationshipsRepository.setLevel.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, BAND_ID, {
        memberId1: "a",
        memberId2: "z",
        level: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
