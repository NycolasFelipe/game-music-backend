import { SKILL_MAX } from "@/modules/band-members/domain/constants/skill.constant";
import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import {
  evaluateMemberGrowth,
  grownSkill,
  prideHappinessDelta,
  type GrowthMemberInput,
} from "@/modules/releases/domain/growth/growth.calculator";

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
): GrowthMemberInput => ({
  id,
  name: `Member ${id}`,
  skills: skills(partial),
  happiness,
});

describe("grownSkill", () => {
  it("teaches more from a masterpiece than from a flop", () => {
    const fromFlop = grownSkill(3, 10, 1);
    const fromMasterpiece = grownSkill(3, 95, 1);

    expect(fromMasterpiece - 3).toBeGreaterThan((fromFlop - 3) * 2);
  });

  it("scales with the format weight (an album beats a single)", () => {
    expect(grownSkill(3, 70, 1.4) - 3).toBeGreaterThan(
      grownSkill(3, 70, 0.6) - 3,
    );
  });

  it("shrinks the gain as the skill approaches the cap", () => {
    const early = grownSkill(1, 70, 1) - 1;
    const late = grownSkill(9, 70, 1) - 9;

    expect(early).toBeGreaterThan(late);
    expect(late).toBeGreaterThan(0);
  });

  it("never exceeds the skill cap", () => {
    expect(grownSkill(SKILL_MAX, 100, 5)).toBe(SKILL_MAX);
    expect(grownSkill(9.99, 100, 5)).toBeLessThanOrEqual(SKILL_MAX);
  });
});

describe("prideHappinessDelta", () => {
  it("rewards a great work and punishes a bad one, symmetrically", () => {
    expect(prideHappinessDelta(100)).toBe(0.5);
    expect(prideHappinessDelta(0)).toBe(-0.5);
    expect(prideHappinessDelta(50)).toBe(0);
  });
});

describe("evaluateMemberGrowth", () => {
  it("grows each credited member only in the aspects they covered", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { vocal: ["m1"], lyrics: ["m1", "m2"] },
      members: [
        member("m1", { vocal: 4, lyrics: 2 }),
        member("m2", { lyrics: 6 }),
      ],
      quality: 80,
      formatWeight: 1.2,
    });

    const first = outcomes.find((o) => o.memberId === "m1");
    expect(first?.record.gains.map((g) => g.skill).sort()).toEqual([
      "lyrics",
      "vocal",
    ]);
    // Untouched aspects keep their value.
    expect(first?.skills.guitar).toBe(0);
    expect(first?.skills.vocal).toBeGreaterThan(4);

    const second = outcomes.find((o) => o.memberId === "m2");
    expect(second?.record.gains).toHaveLength(1);
    expect(second?.skills.lyrics).toBeGreaterThan(6);
  });

  it("gives co-credited members the full gain (crediting a rookie trains them)", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { guitar: ["m1", "m2", "m3"] },
      members: [
        member("m1", { guitar: 2 }),
        member("m2", { guitar: 2 }),
        member("m3", { guitar: 2 }),
      ],
      quality: 70,
      formatWeight: 1,
    });

    const gains = outcomes.map((o) => o.skills.guitar);
    expect(new Set(gains).size).toBe(1);
    expect(gains[0]).toBeGreaterThan(2);
  });

  it("flags a level-up when the whole number goes up", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { piano: ["m1"] },
      members: [member("m1", { piano: 3.9 })],
      quality: 90,
      formatWeight: 1.4,
    });

    expect(outcomes[0].record.gains[0].leveledUp).toBe(true);
    expect(outcomes[0].record.gains[0].from).toBe(3.9);
    expect(outcomes[0].record.gains[0].to).toBeGreaterThanOrEqual(4);
  });

  it("applies pride to the credited members, clamped to the happiness range", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { drums: ["m1"], bass: ["m2"] },
      members: [member("m1", { drums: 5 }, 4.9), member("m2", { bass: 5 }, 0)],
      quality: 100,
      formatWeight: 1,
    });

    expect(outcomes[0].happiness).toBe(5);
    expect(outcomes[1].happiness).toBe(0.5);
    expect(outcomes[1].record.happinessDelta).toBe(0.5);
  });

  it("ignores uncredited members and credits of members who already left", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { vocal: ["gone"], guitar: ["m1"] },
      members: [member("m1", { guitar: 3 }), member("m2", { vocal: 8 })],
      quality: 60,
      formatWeight: 1,
    });

    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].memberId).toBe("m1");
  });

  it("records no gain for an aspect already at the cap", () => {
    const outcomes = evaluateMemberGrowth({
      credits: { vocal: ["m1"] },
      members: [member("m1", { vocal: SKILL_MAX })],
      quality: 90,
      formatWeight: 1.4,
    });

    expect(outcomes[0].record.gains).toHaveLength(0);
    expect(outcomes[0].skills.vocal).toBe(SKILL_MAX);
    // Pride still applies — the work was theirs.
    expect(outcomes[0].record.happinessDelta).toBeGreaterThan(0);
  });

  it("returns nothing when nobody is credited", () => {
    expect(
      evaluateMemberGrowth({
        credits: {},
        members: [member("m1", { vocal: 3 })],
        quality: 80,
        formatWeight: 1,
      }),
    ).toEqual([]);
  });
});
