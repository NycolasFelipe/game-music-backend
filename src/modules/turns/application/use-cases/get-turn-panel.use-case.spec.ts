import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BAND_ACTIVITIES_REPOSITORY } from "@/modules/activities/domain/repositories/band-activities.repository";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import { PreviewGigsUseCase } from "@/modules/gigs/application/use-cases/preview-gigs.use-case";
import { GIGS_REPOSITORY } from "@/modules/gigs/domain/repositories/gigs.repository";
import { SATURATION_FACTORS } from "@/modules/releases/domain/constants/release.constant";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import { ForecastTurnUseCase } from "@/modules/turns/application/use-cases/forecast-turn.use-case";
import { GetTurnPanelUseCase } from "@/modules/turns/application/use-cases/get-turn-panel.use-case";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";
const YEAR = 2004.5;

const band = {
  id: BAND_ID,
  currentYear: YEAR,
  fanCount: 500,
  balance: 3000,
  autoSalaryAdjust: true,
};
const members = [
  {
    id: "m1",
    skills: { vocal: 3, guitar: 3, bass: 3, drums: 3, piano: 3, lyrics: 3 },
    happiness: 1,
  },
];
const forecast = {
  balance: 3000,
  royalties: 0,
  royaltyPayouts: [],
  salaryRaises: 0,
  payroll: 100,
  balanceAfter: 2900,
  atRiskMemberIds: [],
  departingMemberIds: [],
};
const previews = { performance: 0.33, previews: [{ gigTypeId: "bar" }] };

describe("GetTurnPanelUseCase", () => {
  let useCase: GetTurnPanelUseCase;
  let bandsRepository: { findByIdAndOwnerWithMembers: jest.Mock };
  let activeEventsRepository: { findByBandId: jest.Mock };
  let releasesRepository: {
    findInCreation: jest.Mock;
    findCreationEventsByRelease: jest.Mock;
    countLaunchedInYear: jest.Mock;
  };
  let gigsRepository: { findByBandId: jest.Mock };
  let activitiesRepository: { countByBandAndYear: jest.Mock };
  let previewGigs: { execute: jest.Mock };
  let forecastTurn: { execute: jest.Mock };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest
        .fn()
        .mockResolvedValue({ band, members, relationships: [] }),
    };
    activeEventsRepository = { findByBandId: jest.fn().mockResolvedValue([]) };
    releasesRepository = {
      findInCreation: jest.fn().mockResolvedValue(null),
      findCreationEventsByRelease: jest.fn().mockResolvedValue([]),
      countLaunchedInYear: jest.fn().mockResolvedValue(0),
    };
    gigsRepository = { findByBandId: jest.fn().mockResolvedValue([]) };
    activitiesRepository = {
      countByBandAndYear: jest.fn().mockResolvedValue(0),
    };
    previewGigs = { execute: jest.fn().mockReturnValue(previews) };
    forecastTurn = { execute: jest.fn().mockResolvedValue(forecast) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetTurnPanelUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: activeEventsRepository },
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
        { provide: GIGS_REPOSITORY, useValue: gigsRepository },
        { provide: BAND_ACTIVITIES_REPOSITORY, useValue: activitiesRepository },
        { provide: PreviewGigsUseCase, useValue: previewGigs },
        { provide: ForecastTurnUseCase, useValue: forecastTurn },
      ],
    }).compile();
    useCase = moduleRef.get(GetTurnPanelUseCase);
  });

  it("throws NotFoundException when the band is not the actor's", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);

    await expect(useCase.execute(actor, BAND_ID)).rejects.toThrow(
      NotFoundException,
    );
    expect(forecastTurn.execute).not.toHaveBeenCalled();
  });

  it("returns a quiet panel for a band with nothing pending", async () => {
    const result = await useCase.execute(actor, BAND_ID);

    expect(bandsRepository.findByIdAndOwnerWithMembers).toHaveBeenCalledWith(
      BAND_ID,
      actor.id,
    );
    expect(result).toEqual({
      year: YEAR,
      period: "21 de outubro de 2004",
      performance: 0.33,
      pending: [],
      gig: { playedThisTurn: null, previews: previews.previews },
      activity: { heldThisTurn: false },
      studio: {
        release: null,
        launchesThisYear: 0,
        nextMarketMultiplier: SATURATION_FACTORS[0],
      },
      forecast,
    });
    expect(activitiesRepository.countByBandAndYear).toHaveBeenCalledWith(
      BAND_ID,
      YEAR,
    );
    expect(releasesRepository.countLaunchedInYear).toHaveBeenCalledWith(
      BAND_ID,
      2004,
    );
  });

  it("feeds the previews and the forecast with the band's state", async () => {
    await useCase.execute(actor, BAND_ID);

    expect(previewGigs.execute).toHaveBeenCalledWith({
      fanCount: 500,
      members: [{ id: "m1", skills: members[0].skills, happiness: 1 }],
    });
    expect(forecastTurn.execute).toHaveBeenCalledWith({
      bandId: BAND_ID,
      balance: 3000,
      fanCount: 500,
      autoSalaryAdjust: true,
      members,
    });
  });

  it("lists unresolved active events and studio sessions as blocking", async () => {
    activeEventsRepository.findByBandId.mockResolvedValue([
      { id: "e1", title: "Briga no camarim", resolved: false },
      { id: "e0", title: "Antigo", resolved: true },
    ]);
    releasesRepository.findInCreation.mockResolvedValue({
      id: "r1",
      title: "Noite Longa",
      format: "ep",
      productionTurnsLeft: 1,
    });
    releasesRepository.findCreationEventsByRelease.mockResolvedValue([
      {
        id: "s1",
        releaseId: "r1",
        prompt: "O baterista sumiu",
        resolved: false,
      },
      { id: "s0", releaseId: "r1", prompt: "Velha", resolved: true },
    ]);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.pending).toEqual([
      {
        kind: "active-event",
        id: "e1",
        releaseId: null,
        title: "Briga no camarim",
        blocking: true,
      },
      {
        kind: "studio-session",
        id: "s1",
        releaseId: "r1",
        title: "O baterista sumiu",
        blocking: true,
      },
    ]);
    expect(result.studio.release).toEqual({
      id: "r1",
      title: "Noite Longa",
      format: "ep",
      turnsLeft: 1,
      ready: false,
    });
  });

  it("flags a finished work with no session pending as ready to launch", async () => {
    releasesRepository.findInCreation.mockResolvedValue({
      id: "r1",
      title: "Noite Longa",
      format: "lp",
      productionTurnsLeft: 0,
    });

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.pending).toEqual([
      {
        kind: "release-ready",
        id: "r1",
        releaseId: "r1",
        title: "Noite Longa",
        blocking: false,
      },
    ]);
    expect(result.studio.release?.ready).toBe(true);
  });

  it("does not flag a finished work as ready while a session is pending", async () => {
    releasesRepository.findInCreation.mockResolvedValue({
      id: "r1",
      title: "Noite Longa",
      format: "lp",
      productionTurnsLeft: 0,
    });
    releasesRepository.findCreationEventsByRelease.mockResolvedValue([
      { id: "s1", releaseId: "r1", prompt: "Última mixagem", resolved: false },
    ]);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.pending.map((p) => p.kind)).toEqual(["studio-session"]);
    expect(result.studio.release?.ready).toBe(false);
  });

  it("returns the season played this semester and the get-together slot", async () => {
    const createdAt = new Date();
    gigsRepository.findByBandId.mockResolvedValue([
      {
        id: "g1",
        bandId: BAND_ID,
        gigTypeId: "bar",
        playedAtYear: YEAR,
        fee: 500,
        cost: 100,
        fansGained: 20,
        performance: 0.4,
        happinessDelta: 0.1,
        createdAt,
      },
      {
        id: "g0",
        bandId: BAND_ID,
        gigTypeId: "covers",
        playedAtYear: 2004,
        fee: 200,
        cost: 50,
        fansGained: 5,
        performance: 0.3,
        happinessDelta: 0,
        createdAt,
      },
    ]);
    activitiesRepository.countByBandAndYear.mockResolvedValue(1);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.gig.playedThisTurn).toEqual(
      expect.objectContaining({ id: "g1", gigTypeId: "bar", net: 400 }),
    );
    expect(result.activity.heldThisTurn).toBe(true);
  });

  it("caps the market multiplier at the last saturation step", async () => {
    releasesRepository.countLaunchedInYear.mockResolvedValue(9);

    const result = await useCase.execute(actor, BAND_ID);

    expect(result.studio.launchesThisYear).toBe(9);
    expect(result.studio.nextMarketMultiplier).toBe(
      SATURATION_FACTORS[SATURATION_FACTORS.length - 1],
    );
  });
});
