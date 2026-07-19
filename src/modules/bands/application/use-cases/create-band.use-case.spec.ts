import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { CreateBandInput } from "@/modules/bands/application/dto/create-band.input";
import { CreateBandUseCase } from "@/modules/bands/application/use-cases/create-band.use-case";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { CreateBandMemberSeed } from "@/modules/bands/domain/repositories/bands.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const member = (name: string): CreateBandMemberSeed => ({
  name,
  age: 24,
  gender: "male",
  happiness: 1,
  characteristics: ["creative", "professional"],
  skills: { vocal: 1, guitar: 3, bass: 2, drums: 0, piano: 1, lyrics: 2 },
  biography: "bio",
  primarySkill: "guitar",
  joinYear: 1990,
});

const input = (count: number): CreateBandInput => ({
  name: "Os Rebeldes",
  theme: "grunge",
  origin: "seattle",
  foundationYear: 1990,
  members: Array.from({ length: count }, (_, i) => member(`M${i}`)),
});

describe("CreateBandUseCase", () => {
  let useCase: CreateBandUseCase;
  let bandsRepository: { createWithMembers: jest.Mock };

  beforeEach(async () => {
    bandsRepository = { createWithMembers: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateBandUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(CreateBandUseCase);
  });

  it("persists the band with members and returns the composed view", async () => {
    const band = new BandEntity(
      "band-1",
      actor.id,
      "Os Rebeldes",
      "grunge",
      "seattle",
      1990,
      0,
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-01T00:00:00Z"),
    );
    bandsRepository.createWithMembers.mockResolvedValue({
      band,
      members: [],
      relationships: [],
    });

    const result = await useCase.execute(actor, input(3));

    expect(bandsRepository.createWithMembers).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: actor.id, name: "Os Rebeldes" }),
      expect.arrayContaining([expect.objectContaining({ name: "M0" })]),
    );
    expect(result).toMatchObject({
      id: "band-1",
      name: "Os Rebeldes",
      members: [],
    });
  });

  it("rejects fewer than 3 members", async () => {
    await expect(useCase.execute(actor, input(2))).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(bandsRepository.createWithMembers).not.toHaveBeenCalled();
  });

  it("rejects more than 6 members", async () => {
    await expect(useCase.execute(actor, input(7))).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(bandsRepository.createWithMembers).not.toHaveBeenCalled();
  });
});
