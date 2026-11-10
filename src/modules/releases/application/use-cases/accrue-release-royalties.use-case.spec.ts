import { Test } from "@nestjs/testing";
import { AccrueReleaseRoyaltiesUseCase } from "@/modules/releases/application/use-cases/accrue-release-royalties.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";

describe("AccrueReleaseRoyaltiesUseCase", () => {
  let useCase: AccrueReleaseRoyaltiesUseCase;
  let releasesRepository: {
    findActiveRoyaltyReleases: jest.Mock;
    applyRoyaltyPayout: jest.Mock;
  };

  beforeEach(async () => {
    releasesRepository = {
      findActiveRoyaltyReleases: jest.fn(),
      applyRoyaltyPayout: jest.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccrueReleaseRoyaltiesUseCase,
        { provide: RELEASES_REPOSITORY, useValue: releasesRepository },
      ],
    }).compile();
    useCase = moduleRef.get(AccrueReleaseRoyaltiesUseCase);
  });

  it("returns 0 and writes nothing when no releases are earning", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([]);
    expect(await useCase.execute("band-1")).toEqual({ total: 0, payouts: [] });
    expect(releasesRepository.applyRoyaltyPayout).not.toHaveBeenCalled();
  });

  it("pays a decaying share and decrements the tail", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      {
        id: "rel-1",
        title: "Disco",
        royaltyRemaining: 1000,
        royaltyTurnsLeft: 4,
      },
    ]);

    const credited = await useCase.execute("band-1");

    expect(credited).toEqual({
      total: 500,
      payouts: [
        {
          releaseId: "rel-1",
          title: "Disco",
          amount: 500,
          turnsLeft: 3,
          remaining: 500,
        },
      ],
    });
    expect(releasesRepository.applyRoyaltyPayout).toHaveBeenCalledWith(
      "rel-1",
      {
        royaltyRemaining: 500,
        royaltyTurnsLeft: 3,
      },
    );
  });

  it("clears the tail on the last turn", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      { id: "rel-1", royaltyRemaining: 250, royaltyTurnsLeft: 1 },
    ]);

    const credited = await useCase.execute("band-1");

    expect(credited.total).toBe(250);
    expect(credited.payouts[0]).toMatchObject({ turnsLeft: 0, remaining: 0 });
    expect(releasesRepository.applyRoyaltyPayout).toHaveBeenCalledWith(
      "rel-1",
      {
        royaltyRemaining: 0,
        royaltyTurnsLeft: 0,
      },
    );
  });

  it("leaves releases with nothing to pay out of the breakdown", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      { id: "rel-1", royaltyRemaining: 0, royaltyTurnsLeft: 2 },
    ]);

    expect(await useCase.execute("band-1")).toEqual({ total: 0, payouts: [] });
    expect(releasesRepository.applyRoyaltyPayout).not.toHaveBeenCalled();
  });

  it("sums payouts across multiple releases", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      { id: "rel-1", royaltyRemaining: 1000, royaltyTurnsLeft: 4 },
      { id: "rel-2", royaltyRemaining: 200, royaltyTurnsLeft: 1 },
    ]);

    const credited = await useCase.execute("band-1");
    expect(credited.total).toBe(700);
    expect(credited.payouts.map((p) => p.amount)).toEqual([500, 200]);
    expect(releasesRepository.applyRoyaltyPayout).toHaveBeenCalledTimes(2);
  });
});
