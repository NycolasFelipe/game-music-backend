import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { FinalizeReleaseUseCase } from "@/modules/releases/application/use-cases/finalize-release.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const skills = (partial: Partial<Skills>): Skills => ({
  vocal: 0,
  guitar: 0,
  bass: 0,
  drums: 0,
  piano: 0,
  lyrics: 0,
  ...partial,
});

const composed = (balance = 5000) => ({
  band: { id: "band-1", balance, fanCount: 100, currentYear: 1991 },
  members: [
    { id: "m1", skills: skills({ vocal: 8, guitar: 6 }), happiness: 2 },
  ],
  relationships: [],
});

const draft = {
  id: "rel-1",
  bandId: "band-1",
  status: "em_criacao" as const,
  format: "lp",
  style: "grunge",
  budgetTier: "estudio",
  credits: { vocal: ["m1"], guitar: ["m1"] },
  creationLog: [],
};

describe("FinalizeReleaseUseCase", () => {
  let useCase: FinalizeReleaseUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let releasesRepository: {
    findByIdAndBand: jest.Mock;
    findCreationEventsByRelease: jest.Mock;
    finalize: jest.Mock;
  };

  beforeEach(async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn().mockResolvedValue(composed()),
      applyBandStateChanges: jest.fn().mockResolvedValue(undefined),
    };
    releasesRepository = {
      findByIdAndBand: jest.fn().mockResolvedValue(draft),
      findCreationEventsByRelease: jest.fn().mockResolvedValue([]),
      finalize: jest.fn((id, data) => ({
        ...draft,
        status: "lancada",
        royaltyRemaining: data.royaltyRemaining,
        royaltyTurnsLeft: data.royaltyTurnsLeft,
        ...data,
      })),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        FinalizeReleaseUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(FinalizeReleaseUseCase);
  });

  afterEach(() => jest.restoreAllMocks());

  it("launches the draft, applies balance/fans and records the royalty tail", async () => {
    const result = await useCase.execute(actor, "band-1", "rel-1");

    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      "band-1",
      expect.objectContaining({
        balance: expect.any(Number),
        fanCount: expect.any(Number),
      }),
    );
    expect(releasesRepository.finalize).toHaveBeenCalledWith(
      "rel-1",
      expect.objectContaining({
        releasedAtYear: 1991,
        royaltyTurnsLeft: expect.any(Number),
      }),
    );
    expect(result.status).toBe("lancada");
  });

  it("throws NotFound when the release is missing", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, "band-1", "rel-x"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("refuses to finalize an already-launched release", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue({
      ...draft,
      status: "lancada",
    });
    await expect(
      useCase.execute(actor, "band-1", "rel-1"),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
