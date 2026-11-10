import { SKILL_TYPES } from "@/modules/band-members/domain/constants/skill.constant";
import {
  areCharacteristicsCompatible,
  CHARACTERISTIC_IDS,
} from "@/modules/band-members/domain/data/characteristics";
import { BIOGRAPHIES } from "@/modules/band-members/domain/data/biographies";
import {
  generateBandMember,
  hasGenderMarkers,
} from "@/modules/band-members/domain/generation/character.generator";

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
      expect(["male", "female", "neutral"]).toContain(member.gender);
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

  it("gives neutral members a neutral avatar and an uninflected biography", () => {
    // Every roll at 0.05 lands in the neutral share (ADR-0027).
    jest.spyOn(Math, "random").mockReturnValue(0.05);
    const member = generateBandMember();
    jest.restoreAllMocks();

    expect(member.gender).toBe("neutral");
    expect(member.avatar.startsWith("\u{1F9D1}")).toBe(true);
    const neutralTexts = BIOGRAPHIES.filter(
      (b) => !hasGenderMarkers(b.text),
    ).map((b) => b.text.replace(/\[nome( do personagem)?\]/g, member.name));
    expect(neutralTexts).toContain(member.biography);
  });

  it.each(SKILL_TYPES)(
    "has at least 3 uninflected biographies for %s (ADR-0027)",
    (skill) => {
      const neutral = BIOGRAPHIES.filter(
        (b) => b.skill === skill && !hasGenderMarkers(b.text),
      );
      expect(neutral.length).toBeGreaterThanOrEqual(3);
    },
  );

  it("has unique biography ids", () => {
    const ids = BIOGRAPHIES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tells inflected biography templates from neutral ones", () => {
    expect(hasGenderMarkers("Criad[o-a] em coral, [nome] canta.")).toBe(true);
    expect(
      hasGenderMarkers("[nome] passou anos cantando em filas de banco."),
    ).toBe(false);
  });
});
