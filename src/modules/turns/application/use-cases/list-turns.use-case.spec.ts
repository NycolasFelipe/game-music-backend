import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { ListTurnsUseCase } from "@/modules/turns/application/use-cases/list-turns.use-case";
import { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";
import { TURNS_REPOSITORY } from "@/modules/turns/domain/repositories/turns.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

describe("ListTurnsUseCase", () => {
  let useCase: ListTurnsUseCase;
  let bandsRepository: { findByIdAndOwner: jest.Mock };
  let turnsRepository: { findByBandId: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwner: jest.fn() };
    turnsRepository = { findByBandId: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListTurnsUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: TURNS_REPOSITORY, useValue: turnsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(ListTurnsUseCase);
  });

  it("returns the band's turns as views with a formatted period", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue({ id: BAND_ID });
    turnsRepository.findByBandId.mockResolvedValue([
      new TurnEntity("t1", BAND_ID, 2003.5, 500, "pe-1", null, new Date()),
    ]);

    const result = await useCase.execute(actor, BAND_ID);

    expect(turnsRepository.findByBandId).toHaveBeenCalledWith(BAND_ID);
    expect(result).toEqual([
      expect.objectContaining({
        year: 2003.5,
        period: "2003 - 2º semestre",
        fanCount: 500,
        passiveEventId: "pe-1",
        activeEventId: null,
      }),
    ]);
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwner.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(turnsRepository.findByBandId).not.toHaveBeenCalled();
  });
});
