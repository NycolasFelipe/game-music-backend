import { Test } from "@nestjs/testing";
import { ArchiveMemberDeparturesUseCase } from "@/modules/band-members/application/use-cases/archive-member-departures.use-case";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { FormerMemberEntity } from "@/modules/band-members/domain/entities/former-member.entity";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { FORMER_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/former-members.repository";
import { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";

const BAND_ID = "band-1";
const skills = { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 };

const buildMember = (id: string, name: string) =>
  new BandMemberEntity(
    id,
    BAND_ID,
    name,
    24,
    "male",
    "👨",
    1,
    ["greedy"],
    skills,
    "bio",
    "guitar",
    2000,
    300,
    3,
    new Date(),
    new Date(),
  );

describe("ArchiveMemberDeparturesUseCase", () => {
  let useCase: ArchiveMemberDeparturesUseCase;
  let membersRepository: { findByBandId: jest.Mock };
  let relationshipsRepository: { findByBandId: jest.Mock };
  let formerMembersRepository: { createMany: jest.Mock };

  beforeEach(async () => {
    membersRepository = { findByBandId: jest.fn() };
    relationshipsRepository = { findByBandId: jest.fn() };
    formerMembersRepository = { createMany: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ArchiveMemberDeparturesUseCase,
        { provide: BAND_MEMBERS_REPOSITORY, useValue: membersRepository },
        {
          provide: MEMBER_RELATIONSHIPS_REPOSITORY,
          useValue: relationshipsRepository,
        },
        {
          provide: FORMER_MEMBERS_REPOSITORY,
          useValue: formerMembersRepository,
        },
      ],
    }).compile();
    useCase = moduleRef.get(ArchiveMemberDeparturesUseCase);
  });

  it("snapshots the departing member with resolved relationships", async () => {
    membersRepository.findByBandId.mockResolvedValue([
      buildMember("m-1", "Ana"),
      buildMember("m-2", "Beto"),
    ]);
    relationshipsRepository.findByBandId.mockResolvedValue([
      new MemberRelationshipEntity(
        "r-1",
        BAND_ID,
        "m-1",
        "m-2",
        3,
        new Date(),
        new Date(),
      ),
    ]);
    formerMembersRepository.createMany.mockImplementation((data) =>
      Promise.resolve(
        data.map(
          (d: { name: string; relationships: unknown }) =>
            new FormerMemberEntity(
              "fm-1",
              BAND_ID,
              "m-1",
              d.name,
              24,
              "male",
              "👨",
              1,
              ["greedy"],
              skills,
              "bio",
              "guitar",
              2000,
              300,
              3,
              "salario_atrasado",
              2004,
              d.relationships as never,
              new Date(),
            ),
        ),
      ),
    );

    const result = await useCase.execute(BAND_ID, 2004, [
      { memberId: "m-1", unpaidTurns: 3, reason: "salario_atrasado" },
    ]);

    expect(formerMembersRepository.createMany).toHaveBeenCalledWith([
      expect.objectContaining({
        originalMemberId: "m-1",
        name: "Ana",
        unpaidTurns: 3,
        reason: "salario_atrasado",
        leftAtYear: 2004,
        relationships: [{ memberName: "Beto", level: 3 }],
      }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: "Ana",
      relationships: [{ memberName: "Beto", level: 3 }],
    });
  });

  it("returns an empty list when there are no departures", async () => {
    const result = await useCase.execute(BAND_ID, 2004, []);
    expect(result).toEqual([]);
    expect(membersRepository.findByBandId).not.toHaveBeenCalled();
    expect(formerMembersRepository.createMany).not.toHaveBeenCalled();
  });
});
