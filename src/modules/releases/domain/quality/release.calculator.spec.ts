import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { findBudgetTier } from "@/modules/releases/domain/data/budget-tiers";
import { findReleaseFormat } from "@/modules/releases/domain/data/release-formats";
import type { SkillWeights } from "@/modules/releases/domain/data/release-genre-profiles";
import {
  computeMoodModifier,
  computeSkillScore,
  evaluateRelease,
  reachFactor,
  royaltyPayout,
  type ReleaseMemberInput,
} from "@/modules/releases/domain/quality/release.calculator";

const skills = (partial: Partial<Skills>): Skills => ({
  vocal: 0,
  guitar: 0,
  bass: 0,
  drums: 0,
  piano: 0,
  lyrics: 0,
  ...partial,
});

const member = (
  id: string,
  partial: Partial<Skills>,
  happiness = 0,
): ReleaseMemberInput => ({ id, skills: skills(partial), happiness });

const ALL_VOCAL: SkillWeights = {
  vocal: 1,
  guitar: 0,
  bass: 0,
  drums: 0,
  piano: 0,
  lyrics: 0,
};

describe("release.calculator", () => {
  describe("computeSkillScore", () => {
    it("scores a maxed, fully-credited aspect at 1", () => {
      const score = computeSkillScore(
        { vocal: ["m1"] },
        [member("m1", { vocal: 10 })],
        ALL_VOCAL,
      );
      expect(score).toBe(1);
    });

    it("averages multiple members on the same aspect", () => {
      const score = computeSkillScore(
        { vocal: ["m1", "m2"] },
        [member("m1", { vocal: 10 }), member("m2", { vocal: 0 })],
        ALL_VOCAL,
      );
      expect(score).toBeCloseTo(0.5, 5);
    });

    it("scores an unassigned weighted aspect as zero", () => {
      const score = computeSkillScore({}, [], ALL_VOCAL);
      expect(score).toBe(0);
    });
  });

  describe("computeMoodModifier", () => {
    it("is neutral (1) with no credited members", () => {
      expect(computeMoodModifier({}, [])).toBe(1);
    });

    it("lifts quality with happy members and lowers with sad ones", () => {
      const happy = computeMoodModifier({ vocal: ["m1"] }, [
        member("m1", { vocal: 5 }, 5),
      ]);
      const sad = computeMoodModifier({ vocal: ["m1"] }, [
        member("m1", { vocal: 5 }, -5),
      ]);
      expect(happy).toBeGreaterThan(1);
      expect(sad).toBeLessThan(1);
    });
  });

  it("reachFactor grows with fans and is 1 at zero fans", () => {
    expect(reachFactor(0)).toBe(1);
    expect(reachFactor(10_000)).toBeGreaterThan(reachFactor(100));
  });

  describe("evaluateRelease", () => {
    const format = findReleaseFormat("lp")!;
    const budgetTier = findBudgetTier("estudio")!;

    it("a maxed band produces a top-tier, profitable work", () => {
      const result = evaluateRelease({
        format,
        budgetTier,
        genreProfile: ALL_VOCAL,
        credits: { vocal: ["m1"] },
        members: [member("m1", { vocal: 10 }, 5)],
        currentFans: 0,
      });

      expect(result.quality).toBeGreaterThanOrEqual(90);
      expect(result.qualityTier.id).toBe("obra-prima");
      expect(result.fansGained).toBeGreaterThan(0);
      expect(result.revenueTotal).toBeGreaterThan(0);
      // Upfront + tail reconstruct the total.
      expect(result.upfront + result.royaltyTail).toBeCloseTo(
        result.revenueTotal,
        2,
      );
      // Publishing is a fraction of master.
      expect(result.publishingRevenueTotal).toBeLessThan(
        result.masterRevenueTotal,
      );
    });

    it("an unskilled band flops", () => {
      const result = evaluateRelease({
        format,
        budgetTier,
        genreProfile: ALL_VOCAL,
        credits: { vocal: ["m1"] },
        members: [member("m1", { vocal: 1 }, 0)],
        currentFans: 0,
      });
      expect(result.quality).toBeLessThan(35);
      expect(result.qualityTier.id).toBe("fracasso");
    });

    it("cost follows the budget tier multiplier", () => {
      const result = evaluateRelease({
        format,
        budgetTier: findBudgetTier("grande")!,
        genreProfile: ALL_VOCAL,
        credits: { vocal: ["m1"] },
        members: [member("m1", { vocal: 10 })],
        currentFans: 0,
      });
      expect(result.cost).toBeCloseTo(format.baseCost * 1.8, 2);
    });
  });

  describe("royaltyPayout", () => {
    it("pays a decaying share and clears the remainder on the last turn", () => {
      expect(royaltyPayout(1000, 4)).toBe(500);
      expect(royaltyPayout(1000, 1)).toBe(1000);
      expect(royaltyPayout(0, 4)).toBe(0);
      expect(royaltyPayout(1000, 0)).toBe(0);
    });
  });
});
