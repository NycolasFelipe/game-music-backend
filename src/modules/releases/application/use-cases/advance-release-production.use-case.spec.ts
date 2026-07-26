import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { AdvanceReleaseProductionUseCase } from "@/modules/releases/application/use-cases/advance-release-production.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const draft = (productionTurnsLeft: number) => ({
  id: "rel-1",
  bandId: "band-1",
  title: "Ruído Branco",
  credits: { guitar: ["m1"], drums: ["m2"] },
  productionTurnsLeft,
});

const composed = {
  band: { id: "band-1" },
  // Two credited members with traits the generator has events for, so a session
  // always has something to draw from.
  members: [
    { id: "m1", name: "Ana", characteristics: ["perfectionist"] },
    { id: "m2", name: "Beto", characteristics: ["lazy"] },
  ],
  relationships: [],
};

describe("AdvanceReleaseProductionUseCase", () => {
  let useCase: AdvanceReleaseProductionUseCase;
  let bandsRepository: { findByIdAndOwnerWithMembers: jest.Mock };
  let releasesRepository: {
    findInCreation: jest.Mock;
    findByIdAndBand: jest.Mock;
    setProductionTurnsLeft: jest.Mock;
    findCreationEventsByRelease: jest.Mock;
    createCreationEvents: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn().mockResolvedValue(composed),
    };
    releasesRepository = {
      findInCreation: jest.fn().mockResolvedValue(draft(2)),
      findByIdAndBand: jest.fn().mockResolvedValue(draft(2)),
      setProductionTurnsLeft: jest.fn().mockResolvedValue(undefined),
      findCreationEventsByRelease: jest.fn().mockResolvedValue([]),
      createCreationEvents: jest.fn().mockResolvedValue([]),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdvanceReleaseProductionUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(AdvanceReleaseProductionUseCase);
  });

  it("does nothing when the band is not recording anything", async () => {
    releasesRepository.findInCreation.mockResolvedValue(null);

    await expect(useCase.execute(actor, "band-1")).resolves.toBeNull();
    expect(releasesRepository.setProductionTurnsLeft).not.toHaveBeenCalled();
  });

  it("burns a turn and opens the next session while studio time remains", async () => {
    const result = await useCase.execute(actor, "band-1");

    expect(releasesRepository.setProductionTurnsLeft).toHaveBeenCalledWith(
      "rel-1",
      1,
    );
    expect(result).toMatchObject({ turnsLeft: 1, ready: false });
    expect(releasesRepository.createCreationEvents).toHaveBeenCalled();
  });

  it("marks the work ready on the last turn, without a new session", async () => {
    releasesRepository.findInCreation.mockResolvedValue(draft(1));

    const result = await useCase.execute(actor, "band-1");

    expect(releasesRepository.setProductionTurnsLeft).toHaveBeenCalledWith(
      "rel-1",
      0,
    );
    expect(result).toMatchObject({
      turnsLeft: 0,
      ready: true,
      newSession: false,
    });
    expect(releasesRepository.createCreationEvents).not.toHaveBeenCalled();
  });

  it("does not replay a kind of drama the work already went through", async () => {
    releasesRepository.findCreationEventsByRelease.mockResolvedValue([
      { kind: "perfeccionismo" },
    ]);

    await useCase.execute(actor, "band-1");

    const [, created] = releasesRepository.createCreationEvents.mock.calls[0];
    expect(created).toHaveLength(1);
    expect(created[0].kind).toBe("preguica");
    // The session continues the work's numbering.
    expect(created[0].sequence).toBe(1);
  });
});
