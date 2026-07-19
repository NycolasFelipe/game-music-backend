import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { GetBandFameUseCase } from "@/modules/bands/application/use-cases/get-band-fame.use-case";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("GetBandFameUseCase", () => {
  let useCase: GetBandFameUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetBandFameUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GetBandFameUseCase);
  });

  it("derives the fame view from the band's fan count", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      fanCount: 60000,
    });

    const result = await useCase.execute(actor, BAND_ID);

    expect(bandsRepository.findByIdAndOwner).toHaveBeenCalledWith(
      BAND_ID,
      actor.id,
    );
    expect(result).toMatchObject({ level: 11, title: "Nacionais" });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
