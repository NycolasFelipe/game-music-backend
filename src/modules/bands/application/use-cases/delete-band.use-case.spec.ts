import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { DeleteBandUseCase } from "@/modules/bands/application/use-cases/delete-band.use-case";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("DeleteBandUseCase", () => {
  let useCase: DeleteBandUseCase;
  let bandsRepository: { deleteByIdAndOwner: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { deleteByIdAndOwner: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteBandUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(DeleteBandUseCase);
  });

  it("deletes the band scoped to the owner", async () => {
    bandsRepository.deleteByIdAndOwner.mockResolvedValue(true);

    await expect(useCase.execute(actor, "band-1")).resolves.toBeUndefined();
    expect(bandsRepository.deleteByIdAndOwner).toHaveBeenCalledWith(
      "band-1",
      actor.id,
    );
  });

  it("throws NotFoundException when nothing was deleted", async () => {
    bandsRepository.deleteByIdAndOwner.mockResolvedValue(false);

    await expect(useCase.execute(actor, "band-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
