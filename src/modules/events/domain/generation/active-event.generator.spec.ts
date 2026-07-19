import { generateActiveEvent } from "@/modules/events/domain/generation/active-event.generator";
import type {
  EventCharacter,
  EventRelationship,
} from "@/modules/events/domain/generation/generated-active-event";

const characters: EventCharacter[] = [
  { id: "m1", name: "Ana", characteristics: ["creative", "professional"] },
  { id: "m2", name: "Bia", characteristics: ["plagiarist", "hothead"] },
];
const relationships: EventRelationship[] = [
  { memberAId: "m1", memberBId: "m2", level: 0 },
];

function generateMany(overrides?: { fanCount?: number; recent?: Set<string> }) {
  const results = [];
  for (let i = 0; i < 100; i++) {
    const e = generateActiveEvent({
      year: 2003,
      characters,
      relationships,
      fanCount: overrides?.fanCount ?? 200,
      recentTemplateIds: overrides?.recent,
    });
    if (e) results.push(e);
  }
  return results;
}

describe("generateActiveEvent", () => {
  it("produces structurally valid events with placeholders filled", () => {
    const events = generateMany();
    expect(events.length).toBeGreaterThan(0);

    const memberIds = new Set(["m1", "m2"]);
    for (const e of events) {
      expect(e.title).not.toContain("{");
      expect(e.description).not.toContain("{");
      expect(e.options.length).toBeGreaterThan(0);
      expect(e.involvedCharacterIds.length).toBeGreaterThan(0);
      for (const id of e.involvedCharacterIds) {
        expect(memberIds.has(id)).toBe(true);
      }
      for (const opt of e.options) {
        expect(opt.label).not.toContain("{");
      }
    }
  });

  it("never returns a template listed as recent", () => {
    const allIds = new Set(generateMany().map((e) => e.templateId));
    const recent = new Set(allIds);
    const events = generateMany({ recent });
    expect(events).toHaveLength(0);
  });

  it("returns null when there are no characters", () => {
    expect(
      generateActiveEvent({
        year: 2003,
        characters: [],
        relationships: [],
        fanCount: 200,
      }),
    ).toBeNull();
  });
});
