import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { UpdateBandSettingsUseCase } from "@/modules/bands/application/use-cases/update-band-settings.use-case";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const band = (autoSalaryAdjust: boolean) =>
  new BandEntity(
    "band-1",
    actor.id,
    "Os Rebeldes",
    "grunge",
    "seattle",
    1990,
    12,
    1990,
    5000,
    autoSalaryAdjust,
    new Date("2026-01-01T00:00:00Z"),
    new Date("2026-01-01T00:00:00Z"),
  );

describe("UpdateBandSettingsUseCase", () => {
  let useCase: UpdateBandSettingsUseCase;
  let bandsRepository: { updateSettings: jest.Mock };

  beforeEach(async () => {
    bandsRepository = {
      updateSettings: jest.fn().mockResolvedValue(band(true)),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateBandSettingsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(UpdateBandSettingsUseCase);
  });

  it("applies the option and returns the updated band", async () => {
    const result = await useCase.execute(actor, "band-1", {
      autoSalaryAdjust: true,
    });

    expect(bandsRepository.updateSettings).toHaveBeenCalledWith(
      "band-1",
      actor.id,
      { autoSalaryAdjust: true },
    );
    expect(result.autoSalaryAdjust).toBe(true);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.updateSettings.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, "band-x", { autoSalaryAdjust: false }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
