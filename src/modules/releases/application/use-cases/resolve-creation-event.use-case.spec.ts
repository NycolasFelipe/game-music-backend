import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ResolveCreationEventUseCase } from "@/modules/releases/application/use-cases/resolve-creation-event.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const event = (resolved = false) => ({
  id: "ev-1",
  releaseId: "rel-1",
  resolved,
  options: [
    {
      id: "topar",
      label: "Topar",
      description: "",
      effect: {
        type: "probabilistic",
        successChance: 0.3,
        successModifier: 1.18,
        failureModifier: 0.85,
      },
    },
    {
      id: "recusar",
      label: "Seguro",
      description: "",
      effect: { type: "fixed", qualityModifier: 1 },
    },
    {
      id: "caprichar",
      label: "Caprichar",
      description: "",
      effect: { type: "fixed", qualityModifier: 1.08 },
      cost: { extraProductionTurns: 1 },
    },
    {
      id: "lado_a",
      label: "Lado A",
      description: "",
      effect: { type: "fixed", qualityModifier: 1.04 },
      cost: {
        happiness: [{ memberId: "m2", delta: -1 }],
        relationships: [{ memberAId: "m1", memberBId: "m2", delta: -1 }],
      },
    },
  ],
});

const composedBand = {
  band: { id: "band-1" },
  members: [
    { id: "m1", happiness: 1 },
    { id: "m2", happiness: 0.5 },
  ],
  relationships: [{ memberAId: "m1", memberBId: "m2", level: -2 }],
};

describe("ResolveCreationEventUseCase", () => {
  let useCase: ResolveCreationEventUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let releasesRepository: {
    findByIdAndBand: jest.Mock;
    setProductionTurnsLeft: jest.Mock;
    findCreationEvent: jest.Mock;
    resolveCreationEvent: jest.Mock;
    findCreationEventsByRelease: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn().mockResolvedValue(composedBand),
      applyBandStateChanges: jest.fn().mockResolvedValue(undefined),
    };
    releasesRepository = {
      findByIdAndBand: jest.fn().mockResolvedValue({
        id: "rel-1",
        status: "em_criacao",
        productionTurnsLeft: 2,
      }),
      setProductionTurnsLeft: jest.fn().mockResolvedValue(undefined),
      findCreationEvent: jest.fn().mockResolvedValue(event()),
      resolveCreationEvent: jest.fn().mockResolvedValue(undefined),
      findCreationEventsByRelease: jest.fn().mockResolvedValue([]),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResolveCreationEventUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ResolveCreationEventUseCase);
  });

  afterEach(() => jest.restoreAllMocks());

  it("applies a fixed option's modifier", async () => {
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "recusar");
    expect(releasesRepository.resolveCreationEvent).toHaveBeenCalledWith(
      "ev-1",
      {
        chosenOptionId: "recusar",
        qualityModifier: 1,
      },
    );
  });

  it("rolls a probabilistic option — success", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // < successChance
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "topar");
    expect(releasesRepository.resolveCreationEvent).toHaveBeenCalledWith(
      "ev-1",
      {
        chosenOptionId: "topar",
        qualityModifier: 1.18,
      },
    );
  });

  it("rolls a probabilistic option — failure", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.9); // >= successChance
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "topar");
    expect(releasesRepository.resolveCreationEvent).toHaveBeenCalledWith(
      "ev-1",
      {
        chosenOptionId: "topar",
        qualityModifier: 0.85,
      },
    );
  });

  it("charges nothing for a free option", async () => {
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "recusar");
    expect(releasesRepository.setProductionTurnsLeft).not.toHaveBeenCalled();
    expect(bandsRepository.applyBandStateChanges).not.toHaveBeenCalled();
    expect(releasesRepository.findByIdAndBand).toHaveBeenCalledTimes(1);
  });

  it("adds studio time and reloads the draft for the returned view", async () => {
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "caprichar");
    expect(releasesRepository.setProductionTurnsLeft).toHaveBeenCalledWith(
      "rel-1",
      3,
    );
    expect(releasesRepository.findByIdAndBand).toHaveBeenCalledTimes(2);
    expect(bandsRepository.applyBandStateChanges).not.toHaveBeenCalled();
  });

  it("overrules the losing side and sours the pair", async () => {
    await useCase.execute(actor, "band-1", "rel-1", "ev-1", "lado_a");
    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      "band-1",
      {
        memberHappiness: [{ memberId: "m2", happiness: -0.5 }],
        relationshipLevels: [{ memberAId: "m1", memberBId: "m2", level: -3 }],
      },
    );
    expect(releasesRepository.setProductionTurnsLeft).not.toHaveBeenCalled();
  });

  it("throws NotFound when the band is not the actor's", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, "band-1", "rel-1", "ev-1", "recusar"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects an unknown option", async () => {
    await expect(
      useCase.execute(actor, "band-1", "rel-1", "ev-1", "ghost"),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("refuses to resolve an already-resolved event", async () => {
    releasesRepository.findCreationEvent.mockResolvedValue(event(true));
    await expect(
      useCase.execute(actor, "band-1", "rel-1", "ev-1", "recusar"),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("throws NotFound when the event is missing", async () => {
    releasesRepository.findCreationEvent.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, "band-1", "rel-1", "ev-x", "recusar"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
