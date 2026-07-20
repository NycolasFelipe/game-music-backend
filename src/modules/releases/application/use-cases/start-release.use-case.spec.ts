import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { StartReleaseUseCase } from "@/modules/releases/application/use-cases/start-release.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const composed = (balance = 5000) => ({
  band: {
    id: "band-1",
    ownerId: actor.id,
    balance,
    fanCount: 0,
    currentYear: 1990,
  },
  members: [{ id: "m1" }, { id: "m2" }, { id: "m3" }],
  relationships: [],
});

const input = {
  title: "Cinzas",
  concept: "",
  style: "grunge",
  format: "lp",
  budgetTier: "estudio",
  credits: { vocal: ["m1"] },
};

describe("StartReleaseUseCase", () => {
  let useCase: StartReleaseUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
  };
  let releasesRepository: {
    countInCreation: jest.Mock;
    create: jest.Mock;
    createCreationEvents: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwnerWithMembers: jest.fn() };
    releasesRepository = {
      countInCreation: jest.fn().mockResolvedValue(0),
      create: jest.fn((data) => ({
        id: "rel-1",
        status: "em_criacao",
        ...data,
      })),
      createCreationEvents: jest.fn().mockResolvedValue([]),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        StartReleaseUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(StartReleaseUseCase);
  });

  it("creates a draft for a valid request", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed());

    const result = await useCase.execute(actor, "band-1", input);

    expect(releasesRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bandId: "band-1",
        title: "Cinzas",
        format: "lp",
      }),
    );
    expect(result.status).toBe("em_criacao");
  });

  it("throws NotFound when the band is not the owner's", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, "band-x", input),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects an unknown format", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed());
    await expect(
      useCase.execute(actor, "band-1", { ...input, format: "mixtape" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects credits referencing a non-member", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed());
    await expect(
      useCase.execute(actor, "band-1", {
        ...input,
        credits: { vocal: ["ghost"] },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects when no aspect is credited", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed());
    await expect(
      useCase.execute(actor, "band-1", { ...input, credits: {} }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a second concurrent draft", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed());
    releasesRepository.countInCreation.mockResolvedValue(1);
    await expect(
      useCase.execute(actor, "band-1", input),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("rejects when the band cannot afford the cost", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(
      composed(100),
    );
    await expect(
      useCase.execute(actor, "band-1", input),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
