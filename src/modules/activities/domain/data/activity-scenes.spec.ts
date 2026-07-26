import { ACTIVITIES } from "@/modules/activities/domain/data/activities";
import { ACTIVITY_SCENES } from "@/modules/activities/domain/data/activity-scenes";

describe("ACTIVITY_SCENES", () => {
  it("covers every activity in the catalog", () => {
    for (const activity of ACTIVITIES) {
      expect(ACTIVITY_SCENES[activity.id]).toBeDefined();
    }
  });

  it("keeps enough variety for a long campaign", () => {
    for (const activity of ACTIVITIES) {
      const scene = ACTIVITY_SCENES[activity.id];
      expect(scene.openings.length).toBeGreaterThanOrEqual(5);
      expect(scene.tense.length).toBeGreaterThanOrEqual(4);
      expect(scene.warm.length).toBeGreaterThanOrEqual(2);
      expect(scene.neutral.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("names the guest list when it opens and the pair when it matters", () => {
    for (const activity of ACTIVITIES) {
      const scene = ACTIVITY_SCENES[activity.id];
      for (const opening of scene.openings) {
        expect(opening).toContain("{grupo}");
      }
      for (const beat of [...scene.tense, ...scene.warm]) {
        expect(beat).toMatch(/\{a\}|\{b\}/);
      }
    }
  });

  it("uses no placeholder the generator cannot fill", () => {
    const known = /\{(grupo|a|b)\}/g;
    for (const activity of ACTIVITIES) {
      const scene = ACTIVITY_SCENES[activity.id];
      const beats = [
        ...scene.openings,
        ...scene.tense,
        ...scene.warm,
        ...scene.neutral,
      ];
      for (const beat of beats) {
        expect(beat.replace(known, "")).not.toMatch(/[{}]/);
      }
    }
  });
});
