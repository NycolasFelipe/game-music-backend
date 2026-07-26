import { BadRequestException, ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { PlayGigUseCase } from "@/modules/gigs/application/use-cases/play-gig.use-case";
import { GIGS_REPOSITORY } from "@/modules/gigs/domain/repositories/gigs.repository";

const actor = new AuthenticatedUserEntity("owner-1", "user");

const skills = (partial: Partial<Skills>): Skills => ({
  vocal: 0,
  guitar: 0,
  bass: 0,
  drums: 0,
  piano: 0,
  lyrics: 0,
  ...partial,
});

const composed = (fanCount = 100, balance = 5000) => ({
  band: { id: "band-1", fanCount, balance, currentYear: 1991.5 },
  members: [
    {
      id: "m1",
      name: "Ana",
      skills: skills({ vocal: 6, guitar: 5 }),
      happiness: 1,
      primarySkill: "vocal",
    },
    {
      id: "m2",
      name: "Beto",
      skills: skills({ lyrics: 8 }),
      happiness: 1,
      primarySkill: "lyrics",
    },
  ],
  relationships: [],
});

describe("PlayGigUseCase", () => {
  let useCase: PlayGigUseCase;
  let bandsRepository: {
    findByIdAndOwnerWithMembers: jest.Mock;
    applyBandStateChanges: jest.Mock;
  };
  let gigsRepository: { create: jest.Mock; countByBandAndYear: jest.Mock };

  beforeEach(async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    bandsRepository = {
      findByIdAndOwnerWithMembers: jest.fn().mockResolvedValue(composed()),
      applyBandStateChanges: jest.fn().mockResolvedValue(undefined),
    };
    gigsRepository = {
      countByBandAndYear: jest.fn().mockResolvedValue(0),
      create: jest.fn((data) => ({
        id: "gig-1",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        ...data,
      })),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlayGigUseCase,
        { provide: BANDS_REPOSITORY, useValue: bandsRepository },
        { provide: GIGS_REPOSITORY, useValue: gigsRepository },
      ],
    }).compile();
    useCase = moduleRef.get(PlayGigUseCase);
  });

  afterEach(() => jest.restoreAllMocks());

  it("pays the band, brings fans and records the season", async () => {
    const result = await useCase.execute(actor, "band-1", { gigTypeId: "bar" });

    expect(result.gig.gigTypeId).toBe("bar");
    expect(result.gig.playedAtYear).toBe(1991.5);
    expect(result.balance).toBeGreaterThan(5000);
    expect(result.fanCount).toBeGreaterThan(100);
    expect(bandsRepository.applyBandStateChanges).toHaveBeenCalledWith(
      "band-1",
      expect.objectContaining({
        balance: result.balance,
        fanCount: result.fanCount,
        memberHappiness: expect.any(Array),
      }),
    );
  });

  it("builds stage skill on the road, and only for stage players (ADR-0016 §5)", async () => {
    const result = await useCase.execute(actor, "band-1", { gigTypeId: "bar" });

    // Ana is a singer: the road trains her. Beto writes lyrics: it does not.
    expect(result.skillGains).toHaveLength(1);
    expect(result.skillGains[0]).toMatchObject({
      memberId: "m1",
      skill: "vocal",
    });
    expect(result.skillGains[0].to).toBeGreaterThan(result.skillGains[0].from);
  });

  it("refuses a circuit the band's fame cannot reach", async () => {
    await expect(
      useCase.execute(actor, "band-1", { gigTypeId: "festival" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(gigsRepository.create).not.toHaveBeenCalled();
  });

  it("allows only one season per turn", async () => {
    gigsRepository.countByBandAndYear.mockResolvedValue(1);

    await expect(
      useCase.execute(actor, "band-1", { gigTypeId: "bar" }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("refuses when the cash cannot cover the season's costs", async () => {
    bandsRepository.findByIdAndOwnerWithMembers.mockResolvedValue(
      composed(100, 10),
    );

    await expect(
      useCase.execute(actor, "band-1", { gigTypeId: "bar" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
