import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { GetBandUseCase } from "@/modules/bands/application/use-cases/get-band.use-case";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("GetBandUseCase", () => {
  let useCase: GetBandUseCase;
  let bandsRepository: { findByIdAndOwnerWithMembers: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwnerWithMembers: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetBandUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GetBandUseCase);
  });

  it("returns the band with members when found for the owner", async () => {
    const band = new BandEntity(
      "band-1",
      actor.id,
      "Os Rebeldes",
      "grunge",
      "seattle",
      1990,
      12,
      1990,
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-01T00:00:00Z"),
    );
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue({
      band,
      members: [],
      relationships: [],
    });

    const result = await useCase.execute(actor, "band-1");

    expect(bandsRepository.findByIdAndOwnerWithMembers).toHaveBeenCalledWith(
      "band-1",
      actor.id,
    );
    expect(result).toMatchObject({ id: "band-1", fanCount: 12, members: [] });
  });

  it("throws NotFoundException when the band is not found for the owner", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);

    await expect(useCase.execute(actor, "band-x")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
