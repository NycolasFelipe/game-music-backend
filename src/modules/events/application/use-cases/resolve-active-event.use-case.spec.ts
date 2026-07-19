import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ResolveActiveEventUseCase } from "@/modules/events/application/use-cases/resolve-active-event.use-case";
import { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ResolvedEventOption } from "@/modules/events/domain/types/event-consequence";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";
const EVENT_ID = "event-1";

const bandWithMembers = {
  band: { fanCount: 100 },
  members: [{ id: "m1", happiness: 2 }],
  relationships: [],
};

function event(
  resolved: boolean,
  options: ResolvedEventOption[],
): ActiveEventEntity {
  return new ActiveEventEntity(
    EVENT_ID,
    BAND_ID,
    "0001",
    2003,
    "conflito_membros",
    "T",
    "D",
    ["m1"],
    options,
    resolved,
    null,
    null,
    new Date(),
    null,
  );
}

const option: ResolvedEventOption = {
  id: "option_0",
  label: "L",
  description: "D",
  consequence: { description: "done", fanCountChangeAbsolute: 10 },
};

describe("ResolveActiveEventUseCase", () => {
  let useCase: ResolveActiveEventUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let eventsRepository: {
    findByIdAndBandId: jest.Mock;
    markResolved: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn(),
      applyBandStateChanges: jest.fn(),
    };
    eventsRepository = {
      findByIdAndBandId: jest.fn(),
      markResolved: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResolveActiveEventUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: eventsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ResolveActiveEventUseCase);
  });

  it("applies consequences and marks the event resolved", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(
      bandWithMembers,
    );
    const pending = event(false, [option]);
    eventsRepository.findByIdAndBandId.mockResolvedValue(pending);
    eventsRepository.markResolved.mockResolvedValue(event(true, [option]));

    const result = await useCase.execute(actor, BAND_ID, EVENT_ID, "option_0");

    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      BAND_ID,
      expect.objectContaining({ fanCount: 110 }),
    );
    expect(eventsRepository.markResolved).toHaveBeenCalledWith(
      EVENT_ID,
      BAND_ID,
      "option_0",
      expect.objectContaining({ description: "done" }),
    );
    expect(result.applied.fanCount).toBe(110);
    expect(result.event.resolved).toBe(true);
    // 100 fans (level 1) -> 110 fans (level 2): one milestone.
    expect(result.fameChange).toMatchObject({
      previousLevel: 1,
      newLevel: 2,
      leveledUp: true,
      gainedLevels: 1,
    });
    expect(result.fameChange.milestones).toEqual([
      { level: 2, title: "Emergentes", subtitle: expect.any(String) },
    ]);
  });

  it("reports no fame level-up when the level is unchanged", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue({
      band: { fanCount: 5 },
      members: [{ id: "m1", happiness: 2 }],
      relationships: [],
    });
    const pending = event(false, [option]);
    eventsRepository.findByIdAndBandId.mockResolvedValue(pending);
    eventsRepository.markResolved.mockResolvedValue(event(true, [option]));

    const result = await useCase.execute(actor, BAND_ID, EVENT_ID, "option_0");

    // 5 fans -> 15 fans: both level 0, no milestone.
    expect(result.fameChange.leveledUp).toBe(false);
    expect(result.fameChange.milestones).toEqual([]);
  });

  it("throws Conflict when the event is already resolved", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(
      bandWithMembers,
    );
    eventsRepository.findByIdAndBandId.mockResolvedValue(event(true, [option]));

    await expect(
      useCase.execute(actor, BAND_ID, EVENT_ID, "option_0"),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(bandsRepository.applyBandStateChanges).not.toHaveBeenCalled();
  });

  it("throws NotFound when the option does not exist", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(
      bandWithMembers,
    );
    eventsRepository.findByIdAndBandId.mockResolvedValue(
      event(false, [option]),
    );

    await expect(
      useCase.execute(actor, BAND_ID, EVENT_ID, "nope"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, BAND_ID, EVENT_ID, "option_0"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
