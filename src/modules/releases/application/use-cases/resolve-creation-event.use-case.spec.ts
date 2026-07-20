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
  ],
});

describe("ResolveCreationEventUseCase", () => {
  let useCase: ResolveCreationEventUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let releasesRepository: {
    findByIdAndBand: jest.Mock;
    findCreationEvent: jest.Mock;
    resolveCreationEvent: jest.Mock;
    findCreationEventsByRelease: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwner: jest.fn().mockResolvedValue({ id: "band-1" }),
    };
    releasesRepository = {
      findByIdAndBand: jest
        .fn()
        .mockResolvedValue({ id: "rel-1", status: "em_criacao" }),
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
