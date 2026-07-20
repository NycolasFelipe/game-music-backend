import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { GeneratePassiveEventsUseCase } from "@/modules/events/application/use-cases/generate-passive-events.use-case";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import { AccrueReleaseRoyaltiesUseCase } from "@/modules/releases/application/use-cases/accrue-release-royalties.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import { AdvanceTurnUseCase } from "@/modules/turns/application/use-cases/advance-turn.use-case";
import { TURNS_REPOSITORY } from "@/modules/turns/domain/repositories/turns.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("AdvanceTurnUseCase", () => {
  let useCase: AdvanceTurnUseCase;
  let bandsRepository: {
    findByIdAndOwner: jest.Mock;
    advanceTurn: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let activeEventsRepository: { countUnresolved: jest.Mock };
  let releasesRepository: { countInCreation: jest.Mock };
  let turnsRepository: { create: jest.Mock };
  let generatePassiveEvents: { execute: jest.Mock };
  let generateActiveEvent: { execute: jest.Mock };
  let accrueReleaseRoyalties: { execute: jest.Mock };
  let randomSpy: jest.SpyInstance;

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwner: jest.fn(),
      advanceTurn: jest.fn().mockResolvedValue(undefined),
      applyBandStateChanges: jest.fn().mockResolvedValue(undefined),
    };
    activeEventsRepository = {
      countUnresolved: jest.fn().mockResolvedValue(0),
    };
    releasesRepository = {
      countInCreation: jest.fn().mockResolvedValue(0),
    };
    turnsRepository = {
      create: jest.fn().mockImplementation((data: unknown) => data),
    };
    generatePassiveEvents = { execute: jest.fn().mockResolvedValue([]) };
    generateActiveEvent = { execute: jest.fn().mockResolvedValue(null) };
    accrueReleaseRoyalties = { execute: jest.fn().mockResolvedValue(0) };
    randomSpy = jest.spyOn(Math, "random");

    const moduleRef = await Test.createTestingModule({
      providers: [
        AdvanceTurnUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: activeEventsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
        { provide: TURNS_REPOSITORY, useValue: turnsRepository },
        {
          provide: GeneratePassiveEventsUseCase,
          useValue: generatePassiveEvents,
        },
        { provide: GenerateActiveEventUseCase, useValue: generateActiveEvent },
        {
          provide: AccrueReleaseRoyaltiesUseCase,
          useValue: accrueReleaseRoyalties,
        },
      ],
    }).compile();
    useCase = moduleRef.get(AdvanceTurnUseCase);
  });

  afterEach(() => randomSpy.mockRestore());

  it("advances the clock by half a year without aging members mid-year", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 500,
    });
    randomSpy.mockReturnValue(0.9); // above ACTIVE_EVENT_CHANCE

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.previousYear).toBe(2003);
    expect(result.year).toBe(2003.5);
    expect(result.period).toBe("2003 - 2º semestre");
    expect(result.agedMembers).toBe(false);
    expect(bandsRepository.advanceTurn).toHaveBeenCalledWith(BAND_ID, {
      newYear: 2003.5,
      ageMembers: false,
    });
    expect(generateActiveEvent.execute).not.toHaveBeenCalled();
    expect(turnsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ year: 2003.5, fanCountSnapshot: 500 }),
    );
  });

  it("ages members when crossing into a new calendar year", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003.5,
      fanCount: 10,
    });
    randomSpy.mockReturnValue(0.9);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.year).toBe(2004);
    expect(result.period).toBe("2004 - 1º semestre");
    expect(result.agedMembers).toBe(true);
    expect(bandsRepository.advanceTurn).toHaveBeenCalledWith(BAND_ID, {
      newYear: 2004,
      ageMembers: true,
    });
  });

  it("rolls an active event when the chance hits and records its id", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
    });
    generatePassiveEvents.execute.mockResolvedValue([{ id: "pe-1" }]);
    generateActiveEvent.execute.mockResolvedValue({
      id: "ae-1",
      templateId: "t-1",
    });
    randomSpy.mockReturnValue(0.1); // below ACTIVE_EVENT_CHANCE

    const result = await useCase.execute(actor, BAND_ID);

    expect(generateActiveEvent.execute).toHaveBeenCalledWith(
      actor,
      BAND_ID,
      2003.5,
    );
    expect(result.activeEvent).toEqual({ id: "ae-1", templateId: "t-1" });
    expect(turnsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        passiveEventId: "pe-1",
        activeEventId: "ae-1",
      }),
    );
  });

  it("tolerates no eligible active event (NotFound) as no event this turn", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
    });
    generateActiveEvent.execute.mockRejectedValue(new NotFoundException());
    randomSpy.mockReturnValue(0.1);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.activeEvent).toBeNull();
    expect(turnsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ activeEventId: null }),
    );
  });

  it("refuses to advance while active events are unresolved", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
    });
    activeEventsRepository.countUnresolved.mockResolvedValue(1);

    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(bandsRepository.advanceTurn).not.toHaveBeenCalled();
    expect(turnsRepository.create).not.toHaveBeenCalled();
  });

  it("credits release royalties into the band's balance", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
      balance: 1000,
    });
    accrueReleaseRoyalties.execute.mockResolvedValue(250.5);
    randomSpy.mockReturnValue(0.9);

    await useCase.execute(actor, BAND_ID);

    expect(accrueReleaseRoyalties.execute).toHaveBeenCalledWith(BAND_ID);
    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      BAND_ID,
      {
        balance: 1250.5,
      },
    );
  });

  it("does not touch the balance when there are no royalties", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
      balance: 1000,
    });
    randomSpy.mockReturnValue(0.9);

    await useCase.execute(actor, BAND_ID);

    expect(bandsRepository.applyBandStateChanges).not.toHaveBeenCalled();
  });

  it("refuses to advance while a release is in creation", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({
      id: BAND_ID,
      currentYear: 2003,
      fanCount: 10,
    });
    releasesRepository.countInCreation.mockResolvedValue(1);

    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(bandsRepository.advanceTurn).not.toHaveBeenCalled();
    expect(turnsRepository.create).not.toHaveBeenCalled();
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(bandsRepository.advanceTurn).not.toHaveBeenCalled();
  });
});
