import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { ListBandRelationshipsUseCase } from "@/modules/bands/application/use-cases/list-band-relationships.use-case";
import { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("ListBandRelationshipsUseCase", () => {
  let useCase: ListBandRelationshipsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let relationshipsRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    relationshipsRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListBandRelationshipsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: MEMBER_RELATIONSHIPS_REPOSITORY,
          useValue: relationshipsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(ListBandRelationshipsUseCase);
  });

  it("returns the band's relationships as views", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    relationshipsRepository.findByBandId.mockResolvedValue([
      new MemberRelationshipEntity(
        "r-1",
        BAND_ID,
        "a",
        "b",
        2,
        new Date(),
        new Date(),
      ),
    ]);

    const result = await useCase.execute(actor, BAND_ID);
    expect(result).toEqual([{ memberAId: "a", memberBId: "b", level: 2 }]);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(relationshipsRepository.findByBandId).not.toHaveBeenCalled();
  });
});
