import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { CancelReleaseUseCase } from "@/modules/releases/application/use-cases/cancel-release.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("CancelReleaseUseCase", () => {
  let useCase: CancelReleaseUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let releasesRepository: {
    findByIdAndBand: jest.Mock;
    deleteByIdAndBand: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwner: jest.fn().mockResolvedValue({ id: "band-1" }),
    };
    releasesRepository = {
      findByIdAndBand: jest.fn(),
      deleteByIdAndBand: jest.fn().mockResolvedValue(true),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CancelReleaseUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(CancelReleaseUseCase);
  });

  it("deletes a draft in creation", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue({
      id: "rel-1",
      status: "em_criacao",
    });
    await useCase.execute(actor, "band-1", "rel-1");
    expect(releasesRepository.deleteByIdAndBand).toHaveBeenCalledWith(
      "rel-1",
      "band-1",
    );
  });

  it("refuses to discard a launched release", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue({
      id: "rel-1",
      status: "lancada",
    });
    await expect(
      useCase.execute(actor, "band-1", "rel-1"),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(releasesRepository.deleteByIdAndBand).not.toHaveBeenCalled();
  });

  it("throws NotFound when the release is missing", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, "band-1", "rel-x"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
