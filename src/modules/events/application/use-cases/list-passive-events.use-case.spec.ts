import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListPassiveEventsUseCase } from "@/modules/events/application/use-cases/list-passive-events.use-case";
import { PassiveEventEntity } from "@/modules/events/domain/entities/passive-event.entity";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("ListPassiveEventsUseCase", () => {
  let useCase: ListPassiveEventsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let passiveEventsRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    passiveEventsRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListPassiveEventsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        {
          provide: PASSIVE_EVENTS_REPOSITORY,
          useValue: passiveEventsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(ListPassiveEventsUseCase);
  });

  it("returns the band's passive events as views", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    passiveEventsRepository.findByBandId.mockResolvedValue([
      new PassiveEventEntity(
        "e1",
        BAND_ID,
        "pe-01",
        2003,
        "colaboracao_musical",
        "desc",
        ["Anitta", "Ludmilla"],
        new Date(),
      ),
    ]);

    const result = await useCase.execute(actor, BAND_ID);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "e1",
      bandId: BAND_ID,
      artists: ["Anitta", "Ludmilla"],
    });
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
