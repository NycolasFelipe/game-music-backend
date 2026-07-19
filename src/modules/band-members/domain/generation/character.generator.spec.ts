import { SKILL_TYPES } from "@/modules/band-members/domain/constants/skill.constant";
import {
  areCharacteristicsCompatible,
  CHARACTERISTIC_IDS,
} from "@/modules/band-members/domain/data/characteristics";
import { generateBandMember } from "@/modules/band-members/domain/generation/character.generator";

describe("generateBandMember", () => {
  const samples = Array.from({ length: 300 }, () => generateBandMember());

  it("generates skills in 0..3 with at least one at level 3", () => {
    for (const member of samples) {
      const values = SKILL_TYPES.map((k) => member.skills[k]);
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(3);
      }
      expect(values).toContain(3);
    }
  });

  it("sets primarySkill to a highest skill", () => {
    for (const member of samples) {
      const max = Math.max(...SKILL_TYPES.map((k) => member.skills[k]));
      expect(member.skills[member.primarySkill]).toBe(max);
    }
  });

  it("generates 2..4 valid, pairwise-compatible characteristics", () => {
    for (const member of samples) {
      const traits = member.characteristics;
      expect(traits.length).toBeGreaterThanOrEqual(2);
      expect(traits.length).toBeLessThanOrEqual(4);
      for (const id of traits) {
        expect(CHARACTERISTIC_IDS.has(id)).toBe(true);
      }
      for (let i = 0; i < traits.length; i++) {
        for (let j = i + 1; j < traits.length; j++) {
          expect(areCharacteristicsCompatible(traits[i], traits[j])).toBe(true);
        }
      }
    }
  });

  it("keeps age, gender and happiness within range", () => {
    for (const member of samples) {
      expect(member.age).toBeGreaterThanOrEqual(16);
      expect(member.age).toBeLessThanOrEqual(30);
      expect(["male", "female"]).toContain(member.gender);
      expect(member.avatar.length).toBeGreaterThan(0);
      expect(member.happiness).toBeGreaterThanOrEqual(-5);
      expect(member.happiness).toBeLessThanOrEqual(5);
    }
  });

  it("resolves every biography marker (no leftover brackets)", () => {
    for (const member of samples) {
      expect(member.biography.length).toBeGreaterThan(0);
      expect(member.biography).not.toContain("[");
    }
  });
});
