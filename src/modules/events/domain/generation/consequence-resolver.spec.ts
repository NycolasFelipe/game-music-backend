import {
  computeBandStateChanges,
  rollConsequence,
} from "@/modules/events/domain/generation/consequence-resolver";

describe("rollConsequence", () => {
  it("returns a single consequence unchanged", () => {
    const c = { description: "x", fanCountChange: 5 };
    expect(rollConsequence(c)).toBe(c);
  });

  it("returns one entry (without chance) from a weighted list", () => {
    const weighted = [
      { description: "a", chance: 70, fanCountChange: 1 },
      { description: "b", chance: 30, fanCountChange: 2 },
    ];
    for (let i = 0; i < 50; i++) {
      const result = rollConsequence(weighted);
      expect(["a", "b"]).toContain(result.description);
      expect(result).not.toHaveProperty("chance");
    }
  });
});

describe("computeBandStateChanges", () => {
  const members = [
    { id: "m1", happiness: 2 },
    { id: "m2", happiness: 0 },
  ];
  const relationships = [{ memberAId: "m1", memberBId: "m2", level: 2 }];

  it("applies an absolute fan change with a floor of 1", () => {
    const r = computeBandStateChanges({
      eventType: "conflito_membros",
      consequence: { description: "d", fanCountChangeAbsolute: -8 },
      involvedCharacterIds: [],
      currentFanCount: 100,
      members,
      relationships,
    });
    expect(r.fanCount).toBe(92);

    const clamped = computeBandStateChanges({
      eventType: "conflito_membros",
      consequence: { description: "d", fanCountChangeAbsolute: -100 },
      involvedCharacterIds: [],
      currentFanCount: 5,
      members,
      relationships,
    });
    expect(clamped.fanCount).toBe(1);
  });

  it("applies a percentage fan change over the current base", () => {
    const r = computeBandStateChanges({
      eventType: "oportunidade_externa",
      consequence: { description: "d", fanCountChange: 10 },
      involvedCharacterIds: [],
      currentFanCount: 1000,
      members,
      relationships,
    });
    expect(r.fanCount).toBe(1100);
  });

  it("applies explicit happiness only to involved members", () => {
    const r = computeBandStateChanges({
      eventType: "decisao_criativa",
      consequence: { description: "d", happinessChangePercent: 20 },
      involvedCharacterIds: ["m1"],
      currentFanCount: 100,
      members,
      relationships,
    });
    // delta = 20 * 5 / 100 = 1.0; only m1 targeted
    expect(r.memberHappiness).toEqual([{ memberId: "m1", happiness: 3 }]);
  });

  it("computes new relationship levels from deltas (clamped, canonical)", () => {
    const r = computeBandStateChanges({
      eventType: "conflito_membros",
      consequence: {
        description: "d",
        relationshipChanges: [
          { character1Id: "m2", character2Id: "m1", change: -3 },
        ],
      },
      involvedCharacterIds: ["m1", "m2"],
      currentFanCount: 100,
      members,
      relationships,
    });
    expect(r.relationshipLevels).toEqual([
      { memberAId: "m1", memberBId: "m2", level: -1 },
    ]);
  });
});
