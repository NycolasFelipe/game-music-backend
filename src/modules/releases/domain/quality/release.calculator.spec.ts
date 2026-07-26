import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { findBudgetTier } from "@/modules/releases/domain/data/budget-tiers";
import { findReleaseFormat } from "@/modules/releases/domain/data/release-formats";
import type { SkillWeights } from "@/modules/releases/domain/data/release-genre-profiles";
import {
  chemistryFactor,
  computeMoodModifier,
  computeSkillScore,
  creditLoad,
  evaluateRelease,
  focusFactor,
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

/** A style split evenly between vocal and guitar, for the focus tests. */
const HALF_HALF: SkillWeights = {
  vocal: 0.5,
  guitar: 0.5,
  bass: 0,
  drums: 0,
  piano: 0,
  lyrics: 0,
};

describe("release.calculator", () => {
  describe("focusFactor (ADR-0014 §1)", () => {
    it("is full for one aspect and decays as the member spreads out", () => {
      expect(focusFactor(1)).toBe(1);
      expect(focusFactor(2)).toBeLessThan(1);
      expect(focusFactor(6)).toBeLessThan(focusFactor(4));
      expect(focusFactor(6)).toBeGreaterThan(0);
    });

    it("treats an uncredited member as contributing nothing", () => {
      expect(focusFactor(0)).toBe(0);
    });
  });

  describe("creditLoad", () => {
    it("counts the distinct aspects each member took on", () => {
      const load = creditLoad({
        vocal: ["m1"],
        guitar: ["m1", "m2"],
        bass: ["m2"],
      });
      expect(load.get("m1")).toBe(2);
      expect(load.get("m2")).toBe(2);
    });
  });

  describe("chemistryFactor (ADR-0014 §2)", () => {
    const relationships = [
      { memberAId: "m1", memberBId: "m2", level: 5 },
      { memberAId: "m1", memberBId: "m3", level: -5 },
    ];

    it("is neutral for a single member", () => {
      expect(chemistryFactor(["m1"], relationships)).toBe(1);
    });

    it("rewards friends and punishes enemies sharing an aspect", () => {
      expect(chemistryFactor(["m1", "m2"], relationships)).toBeGreaterThan(1);
      expect(chemistryFactor(["m1", "m3"], relationships)).toBeLessThan(1);
    });

    it("reads the pair in either direction and ignores unknown pairs", () => {
      expect(chemistryFactor(["m2", "m1"], relationships)).toBe(
        chemistryFactor(["m1", "m2"], relationships),
      );
      expect(chemistryFactor(["m4", "m5"], relationships)).toBe(1);
    });
  });

  describe("computeSkillScore", () => {
    it("penalizes a member who covers several aspects (ADR-0014 §1)", () => {
      const soloist = [member("m1", { vocal: 10, guitar: 10 })];
      const duo = [
        member("m1", { vocal: 10, guitar: 10 }),
        member("m2", { vocal: 10, guitar: 10 }),
      ];

      const spread = computeSkillScore(
        { vocal: ["m1"], guitar: ["m1"] },
        soloist,
        HALF_HALF,
      );
      const specialized = computeSkillScore(
        { vocal: ["m1"], guitar: ["m2"] },
        duo,
        HALF_HALF,
      );

      expect(spread).toBeCloseTo(focusFactor(2), 5);
      expect(specialized).toBe(1);
      expect(spread).toBeLessThan(specialized);
    });

    it("lets two friends beat the better of them alone (ADR-0014 §2)", () => {
      const members = [member("m1", { vocal: 8 }), member("m2", { vocal: 7 })];
      const friends = [{ memberAId: "m1", memberBId: "m2", level: 5 }];

      const alone = computeSkillScore({ vocal: ["m1"] }, members, ALL_VOCAL);
      const together = computeSkillScore(
        { vocal: ["m1", "m2"] },
        members,
        ALL_VOCAL,
        friends,
      );

      expect(together).toBeGreaterThan(alone);
    });

    it("makes sharing an aspect with a rival worse than working alone", () => {
      const members = [member("m1", { vocal: 8 }), member("m2", { vocal: 8 })];
      const rivals = [{ memberAId: "m1", memberBId: "m2", level: -5 }];

      const alone = computeSkillScore({ vocal: ["m1"] }, members, ALL_VOCAL);
      const together = computeSkillScore(
        { vocal: ["m1", "m2"] },
        members,
        ALL_VOCAL,
        rivals,
      );

      expect(together).toBeLessThan(alone);
    });

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
