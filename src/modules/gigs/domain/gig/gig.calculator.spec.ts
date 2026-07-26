import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import { findGigType } from "@/modules/gigs/domain/data/gig-types";
import {
  drawFactor,
  evaluateGig,
  stageSkill,
  type GigMemberInput,
} from "@/modules/gigs/domain/gig/gig.calculator";

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
): GigMemberInput => ({ id, skills: skills(partial), happiness });

const maxed = (id: string, happiness = 0): GigMemberInput =>
  member(
    id,
    { vocal: 10, guitar: 10, bass: 10, drums: 10, piano: 10 },
    happiness,
  );

const bar = findGigType("bar")!;
const covers = findGigType("covers")!;

describe("stageSkill", () => {
  it("scores a band maxed on every stage skill at 1", () => {
    expect(stageSkill([maxed("m1")])).toBeCloseTo(1, 5);
  });

  it("ignores lyrics — writing does not go on stage", () => {
    expect(stageSkill([member("m1", { lyrics: 10 })])).toBe(0);
  });

  it("averages across the members", () => {
    const score = stageSkill([maxed("m1"), member("m2", {})]);
    expect(score).toBeCloseTo(0.5, 5);
  });

  it("handles an empty band", () => {
    expect(stageSkill([])).toBe(0);
  });
});

describe("drawFactor", () => {
  it("grows with the fan base and never falls below 1", () => {
    expect(drawFactor(0)).toBe(1);
    expect(drawFactor(10_000)).toBeGreaterThan(drawFactor(100));
  });
});

describe("evaluateGig", () => {
  it("pays the floor even for a band that cannot play", () => {
    const result = evaluateGig({
      gigType: bar,
      members: [member("m1", {})],
      currentFans: 0,
    });

    expect(result.performance).toBe(0);
    expect(result.fee).toBeCloseTo(bar.baseFee * 0.5, 1);
    expect(result.fansGained).toBe(0);
    // A dull season is pure wear.
    expect(result.happinessDelta).toBeLessThan(0);
  });

  it("pays more, draws more and lifts the band when it plays well", () => {
    const bad = evaluateGig({
      gigType: bar,
      members: [member("m1", { vocal: 2 })],
      currentFans: 100,
    });
    const great = evaluateGig({
      gigType: bar,
      members: [maxed("m1", 5)],
      currentFans: 100,
    });

    expect(great.fee).toBeGreaterThan(bad.fee);
    expect(great.fansGained).toBeGreaterThan(bad.fansGained);
    // A triumphant season pays back its own wear.
    expect(great.happinessDelta).toBeGreaterThan(0);
  });

  it("keeps the cost fixed and nets it out of the fee", () => {
    const result = evaluateGig({
      gigType: bar,
      members: [maxed("m1")],
      currentFans: 0,
    });

    expect(result.cost).toBe(bar.cost);
    expect(result.net).toBeCloseTo(result.fee - result.cost, 2);
  });

  it("builds far fewer own fans on a covers night (ADR-0016 §2)", () => {
    const own = evaluateGig({
      gigType: bar,
      members: [maxed("m1")],
      currentFans: 500,
    });
    const coverBand = evaluateGig({
      gigType: covers,
      members: [maxed("m1")],
      currentFans: 500,
    });

    expect(coverBand.fansGained).toBeLessThan(own.fansGained);
    // ...but the covers night pays better than the same band's own bar season.
    expect(coverBand.fee).toBeGreaterThan(own.fee);
  });

  it("clamps every member's new happiness to the allowed range", () => {
    const result = evaluateGig({
      gigType: bar,
      members: [member("m1", {}, -4.95)],
      currentFans: 0,
    });

    expect(result.memberHappiness[0].happiness).toBeGreaterThanOrEqual(-5);
  });

  it("applies the caller's variance instead of rolling its own", () => {
    const low = evaluateGig({
      gigType: bar,
      members: [maxed("m1")],
      currentFans: 0,
      variance: 0.9,
    });
    const high = evaluateGig({
      gigType: bar,
      members: [maxed("m1")],
      currentFans: 0,
      variance: 1.1,
    });

    expect(low.performance).toBeLessThan(high.performance);
  });
});
