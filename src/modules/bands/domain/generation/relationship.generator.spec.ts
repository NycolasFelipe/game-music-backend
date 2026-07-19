import {
  canonicalPair,
  generateInitialLevel,
  generateRelationshipsForMembers,
} from "@/modules/bands/domain/generation/relationship.generator";

describe("relationship.generator", () => {
  it("generates initial levels within -5..5", () => {
    for (let i = 0; i < 500; i++) {
      const level = generateInitialLevel();
      expect(level).toBeGreaterThanOrEqual(-5);
      expect(level).toBeLessThanOrEqual(5);
      expect(Number.isInteger(level)).toBe(true);
    }
  });

  it("orders a pair canonically (smaller id first)", () => {
    expect(canonicalPair("b", "a")).toEqual(["a", "b"]);
    expect(canonicalPair("a", "b")).toEqual(["a", "b"]);
  });

  it("generates one canonical relationship per unique pair", () => {
    const ids = ["m3", "m1", "m2", "m4"];
    const rels = generateRelationshipsForMembers(ids);

    // n*(n-1)/2 pairs
    expect(rels).toHaveLength(6);
    for (const rel of rels) {
      expect(rel.memberAId < rel.memberBId).toBe(true);
      expect(rel.level).toBeGreaterThanOrEqual(-5);
      expect(rel.level).toBeLessThanOrEqual(5);
    }
    // no duplicate pairs
    const keys = rels.map((r) => `${r.memberAId}|${r.memberBId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("returns no relationships for fewer than two members", () => {
    expect(generateRelationshipsForMembers([])).toHaveLength(0);
    expect(generateRelationshipsForMembers(["m1"])).toHaveLength(0);
  });
});
