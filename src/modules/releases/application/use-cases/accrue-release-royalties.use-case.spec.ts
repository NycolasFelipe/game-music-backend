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
    expect(await useCase.execute("band-1")).toBe(0);
    expect(releasesRepository.applyRoyaltyPayout).not.toHaveBeenCalled();
  });

  it("pays a decaying share and decrements the tail", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      { id: "rel-1", royaltyRemaining: 1000, royaltyTurnsLeft: 4 },
    ]);

    const credited = await useCase.execute("band-1");

    expect(credited).toBe(500);
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

    expect(credited).toBe(250);
    expect(releasesRepository.applyRoyaltyPayout).toHaveBeenCalledWith(
      "rel-1",
      {
        royaltyRemaining: 0,
        royaltyTurnsLeft: 0,
      },
    );
  });

  it("sums payouts across multiple releases", async () => {
    releasesRepository.findActiveRoyaltyReleases.mockResolvedValue([
      { id: "rel-1", royaltyRemaining: 1000, royaltyTurnsLeft: 4 },
      { id: "rel-2", royaltyRemaining: 200, royaltyTurnsLeft: 1 },
    ]);

    expect(await useCase.execute("band-1")).toBe(700);
    expect(releasesRepository.applyRoyaltyPayout).toHaveBeenCalledTimes(2);
  });
});
