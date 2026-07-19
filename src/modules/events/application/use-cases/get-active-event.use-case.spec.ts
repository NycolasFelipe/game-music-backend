import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GetActiveEventUseCase } from "@/modules/events/application/use-cases/get-active-event.use-case";
import { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("GetActiveEventUseCase", () => {
  let useCase: GetActiveEventUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let eventsRepository: { findByIdAndBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    eventsRepository = { findByIdAndBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetActiveEventUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: eventsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GetActiveEventUseCase);
  });

  it("returns the event when band and event exist for the owner", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    eventsRepository.findByIdAndBandId.mockResolvedValue(
      new ActiveEventEntity(
        "e1",
        BAND_ID,
        "0001",
        2003,
        "conflito_membros",
        "T",
        "D",
        ["m1"],
        [],
        false,
        null,
        null,
        new Date(),
        null,
      ),
    );

    const result = await useCase.execute(actor, BAND_ID, "e1");
    expect(result).toMatchObject({ id: "e1", bandId: BAND_ID });
  });

  it("throws NotFound when the event is not in the band", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    eventsRepository.findByIdAndBandId.mockResolvedValue(null);
    await expect(
      useCase.execute(actor, BAND_ID, "missing"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
