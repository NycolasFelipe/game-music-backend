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
    {
      id: "m1",
      name: "Ana",
      skills: skills({ vocal: 8, guitar: 6 }),
      happiness: 2,
    },
    { id: "m2", name: "Beto", skills: skills({ bass: 4 }), happiness: 0 },
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
  productionTurnsLeft: 0,
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
    countLaunchedInYear: jest.Mock;
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
      countLaunchedInYear: jest.fn().mockResolvedValue(0),
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

  it("develops the credited members and records it on the work (ADR-0012)", async () => {
    const result = await useCase.execute(actor, "band-1", "rel-1");

    const changes = bandsRepository.applyBandStateChanges.mock.calls[0][1];
    // Only the credited member (m1) grows — and only on vocal/guitar.
    expect(changes.memberSkills).toHaveLength(1);
    expect(changes.memberSkills[0].memberId).toBe("m1");
    expect(changes.memberSkills[0].skills.vocal).toBeGreaterThan(8);
    expect(changes.memberSkills[0].skills.guitar).toBeGreaterThan(6);
    expect(changes.memberSkills[0].skills.bass).toBe(0);
    expect(changes.memberHappiness).toEqual([
      { memberId: "m1", happiness: expect.any(Number) },
    ]);

    const growth = result.details?.growth;
    expect(growth).toHaveLength(1);
    expect(growth?.[0]).toMatchObject({ memberId: "m1", name: "Ana" });
    expect(growth?.[0].gains.map((gain) => gain.skill).sort()).toEqual([
      "guitar",
      "vocal",
    ]);
  });

  it("refuses to launch a work still in production (ADR-0015 §1)", async () => {
    releasesRepository.findByIdAndBand.mockResolvedValue({
      ...draft,
      productionTurnsLeft: 2,
    });

    await expect(
      useCase.execute(actor, "band-1", "rel-1"),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(releasesRepository.finalize).not.toHaveBeenCalled();
  });

  it("cuts fans and revenue when the year is already crowded (ADR-0015 §5)", async () => {
    const first = await useCase.execute(actor, "band-1", "rel-1");

    releasesRepository.countLaunchedInYear.mockResolvedValue(1);
    const second = await useCase.execute(actor, "band-1", "rel-1");

    expect(second.fansGained ?? 0).toBeLessThan(first.fansGained ?? 0);
    expect(second.masterRevenueTotal ?? 0).toBeLessThan(
      first.masterRevenueTotal ?? 0,
    );
    // The work itself is just as good — only the market is tired.
    expect(second.quality).toBe(first.quality);
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
