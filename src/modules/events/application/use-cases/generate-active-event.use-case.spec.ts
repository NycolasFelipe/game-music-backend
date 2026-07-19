import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");
const BAND_ID = "band-1";

const member = (id: string, characteristics: string[]) => ({
  id,
  name: id,
  characteristics,
  happiness: 0,
});

describe("GenerateActiveEventUseCase", () => {
  let useCase: GenerateActiveEventUseCase;
  let bandsRepository: { findByIdAndOwnerWithMembers: jest.Mock };
  let eventsRepository: { recentTemplateIds: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { findByIdAndOwnerWithMembers: jest.fn() };
    eventsRepository = { recentTemplateIds: jest.fn(), create: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        GenerateActiveEventUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: ACTIVE_EVENTS_REPOSITORY, useValue: eventsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(GenerateActiveEventUseCase);
  });

  it("generates and persists an eligible event", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue({
      band: { fanCount: 200 },
      members: [member("m1", ["plagiarist"]), member("m2", ["professional"])],
      relationships: [{ memberAId: "m1", memberBId: "m2", level: 0 }],
    });
    eventsRepository.recentTemplateIds.mockResolvedValue([]);
    eventsRepository.create.mockImplementation((data) =>
      Promise.resolve(
        new ActiveEventEntity(
          "e1",
          BAND_ID,
          data.templateId,
          data.year,
          data.type,
          data.title,
          data.description,
          data.involvedCharacterIds,
          data.options,
          false,
          null,
          null,
          new Date(),
          null,
        ),
      ),
    );

    const result = await useCase.execute(actor, BAND_ID, 2003);

    expect(eventsRepository.create).toHaveBeenCalled();
    expect(result.templateId).toBe("0001-melodia-familiar");
    expect(result.resolved).toBe(false);
    expect(result.options.length).toBeGreaterThan(0);
  });

  it("throws NotFound when no event is eligible", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue({
      band: { fanCount: 0 },
      members: [member("m1", ["professional"]), member("m2", ["stable"])],
      relationships: [{ memberAId: "m1", memberBId: "m2", level: 0 }],
    });
    eventsRepository.recentTemplateIds.mockResolvedValue([]);

    await expect(useCase.execute(actor, BAND_ID, 2003)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(eventsRepository.create).not.toHaveBeenCalled();
  });

  it("throws NotFound when the band is not owned by the actor", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(null);
    await expect(useCase.execute(actor, BAND_ID, 2003)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
