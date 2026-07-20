import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { ListBandsUseCase } from "@/modules/bands/application/use-cases/list-bands.use-case";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("ListBandsUseCase", () => {
  let useCase: ListBandsUseCase;
  let bandsRepository: { findAllByOwner: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findAllByOwner: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListBandsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListBandsUseCase);
  });

  it("returns the owner's bands as views (no owner id leaked)", async () => {
    const band = new BandEntity(
      "band-1",
      actor.id,
      "Os Rebeldes",
      "grunge",
      "seattle",
      1990,
      0,
      1990,
      5000,
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-01T00:00:00Z"),
    );
    bandsRepository.findAllByOwner.mockResolvedValue([band]);

    const result = await useCase.execute(actor);

    expect(bandsRepository.findAllByOwner).toHaveBeenCalledWith(actor.id);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "band-1", name: "Os Rebeldes" });
    expect(result[0]).not.toHaveProperty("ownerId");
  });
});
