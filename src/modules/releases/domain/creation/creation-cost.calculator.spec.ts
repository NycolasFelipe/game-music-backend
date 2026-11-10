import { resolveCreationCost } from "@/modules/releases/domain/creation/creation-cost.calculator";

const members = [
  { id: "m1", happiness: 2 },
  { id: "m2", happiness: -4.5 },
];
const relationships = [{ memberAId: "m1", memberBId: "m2", level: 1 }];

describe("creation-cost.calculator", () => {
  it("returns no changes for a free option", () => {
    expect(resolveCreationCost(undefined, members, relationships)).toEqual({
      extraProductionTurns: 0,
      memberHappiness: [],
      relationshipLevels: [],
    });
  });

  it("passes extra production turns through", () => {
    const outcome = resolveCreationCost(
      { extraProductionTurns: 1 },
      members,
      relationships,
    );
    expect(outcome.extraProductionTurns).toBe(1);
  });

  it("never returns negative extra turns", () => {
    const outcome = resolveCreationCost(
      { extraProductionTurns: -2 },
      members,
      relationships,
    );
    expect(outcome.extraProductionTurns).toBe(0);
  });

  it("applies a happiness change as an absolute value", () => {
    const outcome = resolveCreationCost(
      { happiness: [{ memberId: "m1", delta: -1 }] },
      members,
      relationships,
    );
    expect(outcome.memberHappiness).toEqual([{ memberId: "m1", happiness: 1 }]);
  });

  it("clamps happiness at the minimum", () => {
    const outcome = resolveCreationCost(
      { happiness: [{ memberId: "m2", delta: -1 }] },
      members,
      relationships,
    );
    expect(outcome.memberHappiness).toEqual([
      { memberId: "m2", happiness: -5 },
    ]);
  });

  it("skips members who already left the band", () => {
    const outcome = resolveCreationCost(
      { happiness: [{ memberId: "gone", delta: -1 }] },
      members,
      relationships,
    );
    expect(outcome.memberHappiness).toEqual([]);
  });

  it("finds the pair in either order and keeps the stored order", () => {
    const outcome = resolveCreationCost(
      { relationships: [{ memberAId: "m2", memberBId: "m1", delta: -1 }] },
      members,
      relationships,
    );
    expect(outcome.relationshipLevels).toEqual([
      { memberAId: "m1", memberBId: "m2", level: 0 },
    ]);
  });

  it("clamps the relationship level at the minimum", () => {
    const outcome = resolveCreationCost(
      { relationships: [{ memberAId: "m1", memberBId: "m2", delta: -1 }] },
      members,
      [{ memberAId: "m1", memberBId: "m2", level: -5 }],
    );
    expect(outcome.relationshipLevels[0].level).toBe(-5);
  });

  it("skips pairs with no stored relationship", () => {
    const outcome = resolveCreationCost(
      { relationships: [{ memberAId: "m1", memberBId: "m9", delta: -1 }] },
      members,
      relationships,
    );
    expect(outcome.relationshipLevels).toEqual([]);
  });
});
