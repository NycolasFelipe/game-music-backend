import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListReleasesUseCase } from "@/modules/releases/application/use-cases/list-releases.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("ListReleasesUseCase", () => {
  let useCase: ListReleasesUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let releasesRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    releasesRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListReleasesUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListReleasesUseCase);
  });

  it("lists the band's releases as views", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: "band-1" });
    releasesRepository.findByBandId.mockResolvedValue([
      { id: "rel-1", title: "Cinzas", status: "lancada" },
    ]);

    const result = await useCase.execute(actor, "band-1");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "rel-1", title: "Cinzas" });
  });

  it("throws NotFound when the band is not the owner's", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, "band-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
