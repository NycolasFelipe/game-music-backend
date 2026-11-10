import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { ListActivityOptionsUseCase } from "@/modules/activities/application/use-cases/list-activity-options.use-case";
import {
  ACTIVITY_LIMIT_PER_TURN,
  ACTIVITY_RELATIONSHIP_CAP,
} from "@/modules/activities/domain/constants/activity.constant";
import { ACTIVITIES } from "@/modules/activities/domain/data/activities";
import { BAND_ACTIVITIES_REPOSITORY } from "@/modules/activities/domain/repositories/band-activities.repository";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

describe("ListActivityOptionsUseCase", () => {
  let useCase: ListActivityOptionsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let activitiesRepository: { countByBandAndYear: jest.Mock };

  beforeEach(async () => {
    bandsRepository = {
      findByIdAndOwner: jest
        .fn()
        .mockResolvedValue({ id: "band-1", currentYear: 1990, fanCount: 50 }),
    };
    activitiesRepository = {
      countByBandAndYear: jest.fn().mockResolvedValue(0),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListActivityOptionsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: BAND_ACTIVITIES_REPOSITORY, useValue: activitiesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListActivityOptionsUseCase);
  });

  it("prices the whole catalog and lets the band go out once per turn", async () => {
    const result = await useCase.execute(actor, "band-1");

    expect(activitiesRepository.countByBandAndYear).toHaveBeenCalledWith(
      "band-1",
      1990,
    );
    expect(result.activities).toHaveLength(ACTIVITIES.length);
    expect(result.limitPerTurn).toBe(ACTIVITY_LIMIT_PER_TURN);
    expect(result.canHold).toBe(true);
    expect(result.relationshipCap).toBe(ACTIVITY_RELATIONSHIP_CAP);
  });

  it("closes the activities once the band already went out this turn (ADR-0031 §3)", async () => {
    activitiesRepository.countByBandAndYear.mockResolvedValue(1);

    const result = await useCase.execute(actor, "band-1");

    expect(result.heldThisTurn).toBe(1);
    expect(result.canHold).toBe(false);
  });

  it("throws NotFound when the band is not the actor's", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);

    await expect(useCase.execute(actor, "band-1")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
