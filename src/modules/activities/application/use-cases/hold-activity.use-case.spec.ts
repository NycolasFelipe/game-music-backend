import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { HoldActivityUseCase } from "@/modules/activities/application/use-cases/hold-activity.use-case";
import { BAND_ACTIVITIES_REPOSITORY } from "@/modules/activities/domain/repositories/band-activities.repository";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const composed = (balance = 10_000) => ({
  band: { id: "band-1", fanCount: 100, balance, currentYear: 1991.5 },
  members: [
    { id: "m1", name: "Ana", happiness: 0, characteristics: ["loyal"] },
    { id: "m2", name: "Beto", happiness: 0, characteristics: ["hothead"] },
    { id: "m3", name: "Caio", happiness: 0, characteristics: ["stable"] },
  ],
  relationships: [
    { memberAId: "m1", memberBId: "m2", level: -5 },
    { memberAId: "m1", memberBId: "m3", level: 3 },
    { memberAId: "m2", memberBId: "m3", level: 1 },
  ],
});

describe("HoldActivityUseCase", () => {
  let useCase: HoldActivityUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let activitiesRepository: {
    create: jest.Mock;
    countByBandAndYear: jest.Mock;
  };
  let activeEventsRepository: { create: jest.Mock };

  beforeEach(async () => {
    // No trouble unless a test asks for it.
    jest.spyOn(Math, "random").mockReturnValue(0.99);
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn().mockResolvedValue(composed()),
      applyBandStateChanges: jest.fn().mockResolvedValue(undefined),
    };
    activitiesRepository = {
      countByBandAndYear: jest.fn().mockResolvedValue(0),
      create: jest.fn((data) => ({
        id: "act-1",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        ...data,
      })),
    };
    activeEventsRepository = {
      create: jest.fn((data) => ({
        id: "evt-1",
        resolved: false,
        chosenOptionId: null,
        outcome: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        resolvedAt: null,
        ...data,
      })),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        HoldActivityUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: BAND_ACTIVITIES_REPOSITORY,
          useValue: activitiesRepository,
        },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: activeEventsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(HoldActivityUseCase);
  });

  afterEach(() => jest.restoreAllMocks());

  it("charges the cash and only moves who was invited", async () => {
    const result = await useCase.execute(actor, "band-1", {
      activityId: "jantar",
      participantIds: ["m1", "m2"],
    });

    // 120 + 60 * 2 = 240, fame level 1 at 100 fans => * 1.06.
    expect(result.activity.cost).toBe(254.4);
    expect(result.balance).toBe(9745.6);
    expect(result.participants.map((p) => p.memberId)).toEqual(["m1", "m2"]);
    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      "band-1",
      expect.objectContaining({
        balance: 9745.6,
        // Only the pair that went; Caio's bonds are untouched.
        relationshipLevels: [{ memberAId: "m1", memberBId: "m2", level: -4 }],
      }),
    );
  });

  it("refuses a guest who is not in the band", async () => {
    await expect(
      useCase.execute(actor, "band-1", {
        activityId: "jantar",
        participantIds: ["m1", "intruso"],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(activitiesRepository.create).not.toHaveBeenCalled();
  });

  it("refuses a guest list the activity does not take", async () => {
    // A festa takes 3 to 6 people.
    await expect(
      useCase.execute(actor, "band-1", {
        activityId: "festa",
        participantIds: ["m1", "m2"],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("refuses when the cash does not cover it", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(composed(10));

    await expect(
      useCase.execute(actor, "band-1", {
        activityId: "retiro",
        participantIds: ["m1", "m2"],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("refuses an activity that does not exist", async () => {
    await expect(
      useCase.execute(actor, "band-1", {
        activityId: "cruzeiro",
        participantIds: ["m1", "m2"],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("raises a decision on the most hostile pair when the night goes wrong", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const result = await useCase.execute(actor, "band-1", {
      activityId: "festa",
      participantIds: ["m1", "m2", "m3"],
    });

    expect(result.trouble).toBe(true);
    expect(activeEventsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bandId: "band-1",
        type: "confraternizacao",
        involvedCharacterIds: ["m1", "m2"],
      }),
    );
    expect(result.troubleEvent?.id).toBe("evt-1");
    expect(result.activity.troubleEventId).toBe("evt-1");
  });

  it("keeps the good part even when the night goes wrong", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    await useCase.execute(actor, "band-1", {
      activityId: "festa",
      participantIds: ["m1", "m2", "m3"],
    });

    // The party happened; what went wrong came after it.
    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      "band-1",
      expect.objectContaining({
        memberHappiness: [
          { memberId: "m1", happiness: 1 },
          { memberId: "m2", happiness: 1 },
          { memberId: "m3", happiness: 1 },
        ],
      }),
    );
  });
});
