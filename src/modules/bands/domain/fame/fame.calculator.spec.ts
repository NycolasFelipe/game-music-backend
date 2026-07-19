import {
  calculateFameLevel,
  computeFameProgress,
  describeFame,
} from "@/modules/bands/domain/fame/fame.calculator";

describe("fame calculator", () => {
  describe("calculateFameLevel", () => {
    it("starts at level 0 for a fresh band", () => {
      expect(calculateFameLevel(0)).toBe(0);
    });

    it("treats the level bound as inclusive and the next fan as a level up", () => {
      expect(calculateFameLevel(50)).toBe(0);
      expect(calculateFameLevel(51)).toBe(1);
    });

    it("caps at level 30 beyond the last threshold", () => {
      expect(calculateFameLevel(1_200_000_000)).toBe(29);
      expect(calculateFameLevel(1_200_000_001)).toBe(30);
    });

    it("falls back to 0 for non-finite input", () => {
      expect(calculateFameLevel(Number.NaN)).toBe(0);
    });
  });

  describe("describeFame", () => {
    it("describes a level-0 band with progression to the next level", () => {
      expect(describeFame(0)).toEqual({
        level: 0,
        title: "Anônimos",
        subtitle: "Tocam só pra amigos e familiares",
        isMaxLevel: false,
        currentLevelMinFans: 0,
        currentLevelMaxFans: 50,
        nextLevelAtFans: 51,
      });
    });

    it("maps a mid-tier fan count to its titled level", () => {
      const fame = describeFame(60000);
      expect(fame.level).toBe(11);
      expect(fame.title).toBe("Nacionais");
      expect(fame.currentLevelMinFans).toBe(50001);
      expect(fame.nextLevelAtFans).toBe(100001);
    });

    it("reports the uncapped top level with no next threshold", () => {
      const fame = describeFame(2_000_000_000);
      expect(fame.level).toBe(30);
      expect(fame.title).toBe("Deuses da Música");
      expect(fame.isMaxLevel).toBe(true);
      expect(fame.currentLevelMinFans).toBe(1_200_000_001);
      expect(fame.currentLevelMaxFans).toBeNull();
      expect(fame.nextLevelAtFans).toBeNull();
    });
  });

  describe("computeFameProgress", () => {
    it("emits one milestone per level gained", () => {
      const progress = computeFameProgress(0, 60000);
      expect(progress.previousLevel).toBe(0);
      expect(progress.newLevel).toBe(11);
      expect(progress.leveledUp).toBe(true);
      expect(progress.gainedLevels).toBe(11);
      expect(progress.milestones).toHaveLength(11);
      expect(progress.milestones[0]).toEqual({
        level: 1,
        title: "Iniciantes",
        subtitle: "Primeiras apresentações em bares vazios",
      });
      expect(progress.milestones.at(-1)?.title).toBe("Nacionais");
    });

    it("reports no progression when the level is unchanged", () => {
      const progress = computeFameProgress(10, 40);
      expect(progress.leveledUp).toBe(false);
      expect(progress.gainedLevels).toBe(0);
      expect(progress.milestones).toEqual([]);
    });

    it("does not emit milestones when fame decreases", () => {
      const progress = computeFameProgress(60000, 0);
      expect(progress.previousLevel).toBe(11);
      expect(progress.newLevel).toBe(0);
      expect(progress.leveledUp).toBe(false);
      expect(progress.gainedLevels).toBe(0);
      expect(progress.milestones).toEqual([]);
    });
  });
});
