import { Test } from "@nestjs/testing";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { PreviewGigsUseCase } from "@/modules/gigs/application/use-cases/preview-gigs.use-case";
import { GIG_TYPES, findGigType } from "@/modules/gigs/domain/data/gig-types";
import { evaluateGig } from "@/modules/gigs/domain/gig/gig.calculator";

const skills = (value: number): Skills => ({
  vocal: value,
  guitar: value,
  bass: value,
  drums: value,
  piano: value,
  lyrics: value,
});

const members = [
  { id: "m1", skills: skills(4), happiness: 1 },
  { id: "m2", skills: skills(3), happiness: -1 },
];

describe("PreviewGigsUseCase", () => {
  let useCase: PreviewGigsUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PreviewGigsUseCase],
    }).compile();
    useCase = moduleRef.get(PreviewGigsUseCase);
  });

  it("previews every circuit of the catalog, in order", () => {
    const result = useCase.execute({ fanCount: 100, members });

    expect(result.previews.map((p) => p.gigTypeId)).toEqual(
      GIG_TYPES.map((g) => g.id),
    );
  });

  it("uses the gig calculator with a neutral variance", () => {
    const bar = findGigType("bar")!;
    const expected = evaluateGig({
      gigType: bar,
      members,
      currentFans: 100,
      variance: 1,
    });

    const result = useCase.execute({ fanCount: 100, members });
    const preview = result.previews.find((p) => p.gigTypeId === "bar")!;

    expect(preview).toEqual({
      gigTypeId: "bar",
      label: bar.label,
      minFameLevel: bar.minFameLevel,
      available: true,
      expectedPerformance: bar.expectedPerformance,
      fee: expected.fee,
      cost: expected.cost,
      net: expected.net,
      fansGained: expected.fansGained,
      happinessDelta: expected.happinessDelta,
    });
    expect(result.performance).toBe(expected.performance);
  });

  it("marks circuits above the band's fame level as unavailable", () => {
    const result = useCase.execute({ fanCount: 0, members });

    for (const preview of result.previews) {
      expect(preview.available).toBe(preview.minFameLevel <= 0);
    }
    expect(result.previews.some((p) => !p.available)).toBe(true);
  });

  it("returns zero performance for a band without members", () => {
    const result = useCase.execute({ fanCount: 0, members: [] });

    expect(result.performance).toBe(0);
  });
});
