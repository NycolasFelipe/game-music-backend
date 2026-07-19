import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GeneratePassiveEventsUseCase } from "@/modules/events/application/use-cases/generate-passive-events.use-case";
import { PassiveEventEntity } from "@/modules/events/domain/entities/passive-event.entity";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import type { CreatePassiveEventData } from "@/modules/events/domain/repositories/passive-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("GeneratePassiveEventsUseCase", () => {
  let useCase: GeneratePassiveEventsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let passiveEventsRepository: {
    recentEvents: jest.Mock;
    createMany: jest.Mock;
  };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    passiveEventsRepository = {
      recentEvents: jest.fn(),
      createMany: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GeneratePassiveEventsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: PASSIVE_EVENTS_REPOSITORY,
          useValue: passiveEventsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(GeneratePassiveEventsUseCase);
  });

  it("generates and persists passive events for the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    passiveEventsRepository.recentEvents.mockResolvedValue([]);
    passiveEventsRepository.createMany.mockImplementation(
      (data: CreatePassiveEventData[]) =>
        Promise.resolve(
          data.map(
            (d, i) =>
              new PassiveEventEntity(
                `e${i}`,
                d.bandId,
                d.templateId,
                d.year,
                d.type,
                d.description,
                d.artists,
                new Date(),
              ),
          ),
        ),
    );

    const result = await useCase.execute(actor, BAND_ID, 2003, 3);

    expect(passiveEventsRepository.createMany).toHaveBeenCalledTimes(1);
    const persisted = passiveEventsRepository.createMany.mock
      .calls[0][0] as CreatePassiveEventData[];
    expect(persisted.length).toBeGreaterThan(0);
    expect(persisted.length).toBeLessThanOrEqual(3);
    for (const e of persisted) {
      expect(e.bandId).toBe(BAND_ID);
      expect(e.description).not.toContain("{");
    }
    expect(result.length).toBe(persisted.length);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, BAND_ID, 2003, 1),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(passiveEventsRepository.createMany).not.toHaveBeenCalled();
  });
});
