import { Test } from "@nestjs/testing";
import { RecordMemberDeparturesUseCase } from "@/modules/events/application/use-cases/record-member-departures.use-case";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";

describe("RecordMemberDeparturesUseCase", () => {
  let useCase: RecordMemberDeparturesUseCase;
  let passiveEventsRepository: { createMany: jest.Mock };

  beforeEach(async () => {
    passiveEventsRepository = {
      createMany: jest.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        RecordMemberDeparturesUseCase,
        {
          provide: PASSIVE_EVENTS_REPOSITORY,
          useValue: passiveEventsRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(RecordMemberDeparturesUseCase);
  });

  it("writes one timeline line per departure, by reason", async () => {
    await useCase.execute("band-1", 1990.5, [
      { memberName: "Ana", unpaidTurns: 3, reason: "salario_atrasado" },
      { memberName: "Beto", unpaidTurns: 0, reason: "humor" },
    ]);

    const [records] = passiveEventsRepository.createMany.mock.calls[0] as [
      Array<{ description: string; year: number; artists: string[] }>,
    ];
    expect(records).toHaveLength(2);
    expect(records[0].description).toContain("sem receber salário");
    expect(records[1].description).toContain("Beto deixou a banda");
    expect(records[1].description).not.toContain("salário");
    expect(records.map((record) => record.year)).toEqual([1990.5, 1990.5]);
    expect(records[1].artists).toEqual(["Beto"]);
  });

  it("writes unpaid time as approximate months and years, never in turns", async () => {
    await useCase.execute("band-1", 1990.5, [
      { memberName: "Ana", unpaidTurns: 1, reason: "salario_atrasado" },
      { memberName: "Bia", unpaidTurns: 2, reason: "salario_atrasado" },
      { memberName: "Caio", unpaidTurns: 3, reason: "salario_atrasado" },
      { memberName: "Duda", unpaidTurns: 4, reason: "salario_atrasado" },
    ]);

    const [records] = passiveEventsRepository.createMany.mock.calls[0] as [
      Array<{ description: string }>,
    ];
    expect(records.map((record) => record.description)).toEqual([
      "Ana deixou a banda após alguns meses sem receber salário.",
      "Bia deixou a banda após cerca de um ano sem receber salário.",
      "Caio deixou a banda após mais de um ano sem receber salário.",
      "Duda deixou a banda após cerca de dois anos sem receber salário.",
    ]);
  });

  it("records nothing when no one left", async () => {
    await useCase.execute("band-1", 1990.5, []);

    expect(passiveEventsRepository.createMany).not.toHaveBeenCalled();
  });
});
