import {
  activityCost,
  evaluateActivity,
  saturationFactor,
  troubleChance,
} from "@/modules/activities/domain/activity/activity.calculator";
import type { Activity } from "@/modules/activities/domain/data/activities";

const activity: Activity = {
  id: "festa",
  label: "Festa",
  description: "",
  emoji: "🎉",
  baseCost: 400,
  costPerParticipant: 150,
  minParticipants: 3,
  maxParticipants: 6,
  happinessGain: 1,
  relationshipGain: 2,
  troubleChance: 0.2,
};

const guest = (id: string, happiness = 0) => ({ id, happiness });

describe("activityCost", () => {
  it("charges a base plus a head count", () => {
    expect(activityCost(activity, 3, 0)).toBe(850);
  });

  it("makes tastes expensive as fame rises", () => {
    // Level 10 => 1 + 10 * 0.06 = 1.6x.
    expect(activityCost(activity, 3, 10)).toBe(1360);
  });
});

describe("saturationFactor", () => {
  it("gives the first activity of the turn its full effect", () => {
    expect(saturationFactor(0)).toBe(1);
  });

  it("dilutes each repetition within the same turn", () => {
    expect(saturationFactor(1)).toBe(0.5);
    expect(saturationFactor(2)).toBe(0.25);
  });

  it("floors at the last factor instead of reaching zero", () => {
    expect(saturationFactor(99)).toBe(0.1);
  });
});

describe("troubleChance", () => {
  it("is the activity's own risk when nobody in the room is hostile", () => {
    expect(troubleChance(activity, 3)).toBe(0.2);
  });

  it("rises with the hostility the player chose to invite", () => {
    // 0.2 + 5 * 0.06 = 0.5.
    expect(troubleChance(activity, -5)).toBe(0.5);
  });

  it("never becomes a certainty", () => {
    expect(troubleChance({ ...activity, troubleChance: 0.7 }, -5)).toBe(0.8);
  });
});

describe("evaluateActivity", () => {
  const relationships = [
    { memberAId: "a", memberBId: "b", level: -4 },
    { memberAId: "a", memberBId: "c", level: 2 },
    { memberAId: "b", memberBId: "c", level: 0 },
  ];

  it("lifts only who went and mends only their pairs", () => {
    const result = evaluateActivity({
      activity,
      participants: [guest("a", 1), guest("b", -2)],
      relationships,
      fameLevel: 0,
      heldThisTurn: 0,
    });

    expect(result.memberHappiness).toEqual([
      { memberId: "a", happiness: 2 },
      { memberId: "b", happiness: -1 },
    ]);
    // Only a×b was in the room; a×c and b×c are untouched.
    expect(result.relationshipLevels).toEqual([
      { memberAId: "a", memberBId: "b", level: -2 },
    ]);
  });

  it("points at the most hostile pair on the guest list", () => {
    const result = evaluateActivity({
      activity,
      participants: [guest("a"), guest("b"), guest("c")],
      relationships,
      fameLevel: 0,
      heldThisTurn: 0,
    });

    expect(result.weakestPair).toEqual({
      memberAId: "a",
      memberBId: "b",
      level: -4,
    });
    // 0.2 + 4 * 0.06 = 0.44.
    expect(result.troubleChance).toBe(0.44);
  });

  it("stops moving relationships once the turn's repetition dilutes the gain", () => {
    const second = evaluateActivity({
      activity,
      participants: [guest("a"), guest("b")],
      relationships,
      fameLevel: 0,
      heldThisTurn: 1,
    });
    // 2 * 0.5 = 1 level still lands...
    expect(second.relationshipDelta).toBe(1);
    expect(second.happinessDelta).toBe(0.5);

    const third = evaluateActivity({
      activity,
      participants: [guest("a"), guest("b")],
      relationships,
      fameLevel: 0,
      heldThisTurn: 2,
    });
    // ...but 2 * 0.25 = 0.5 is not a level, and half a level does not exist.
    expect(third.relationshipDelta).toBe(0);
    expect(third.relationshipLevels).toEqual([
      { memberAId: "a", memberBId: "b", level: -4 },
    ]);
  });

  it("clamps happiness and relationships at their bounds", () => {
    const result = evaluateActivity({
      activity: { ...activity, happinessGain: 3, relationshipGain: 5 },
      participants: [guest("a", 4), guest("c", 0)],
      relationships,
      fameLevel: 0,
      heldThisTurn: 0,
    });

    expect(result.memberHappiness[0].happiness).toBe(5);
    expect(result.relationshipLevels).toEqual([
      { memberAId: "a", memberBId: "c", level: 5 },
    ]);
  });

  it("has no pair to blame when the guests share no relationship", () => {
    const result = evaluateActivity({
      activity,
      participants: [guest("a")],
      relationships,
      fameLevel: 0,
      heldThisTurn: 0,
    });

    expect(result.weakestPair).toBeNull();
    expect(result.troubleChance).toBe(0.2);
  });
});
