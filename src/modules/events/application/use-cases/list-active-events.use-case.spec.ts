import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListActiveEventsUseCase } from "@/modules/events/application/use-cases/list-active-events.use-case";
import { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("ListActiveEventsUseCase", () => {
  let useCase: ListActiveEventsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let eventsRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    eventsRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListActiveEventsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: eventsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListActiveEventsUseCase);
  });

  it("returns the band's events (options stripped of consequences)", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    eventsRepository.findByBandId.mockResolvedValue([
      new ActiveEventEntity(
        "e1",
        BAND_ID,
        "0001",
        2003,
        "conflito_membros",
        "T",
        "D",
        ["m1"],
        [
          {
            id: "option_0",
            label: "L",
            description: "D",
            consequence: { description: "x", fanCountChange: 5 },
          },
        ],
        false,
        null,
        null,
        new Date(),
        null,
      ),
    ]);

    const result = await useCase.execute(actor, BAND_ID);
    expect(result).toHaveLength(1);
    expect(result[0].options[0]).toEqual({
      id: "option_0",
      label: "L",
      description: "D",
    });
    expect(result[0].options[0]).not.toHaveProperty("consequence");
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
