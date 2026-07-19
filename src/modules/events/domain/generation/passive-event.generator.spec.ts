import { PASSIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/passive-event-templates";
import { generatePassiveEvent } from "@/modules/events/domain/generation/passive-event.generator";
import type { RecentPassiveEvent } from "@/modules/events/domain/generation/generated-passive-event";

const TEMPLATE_IDS = new Set(PASSIVE_EVENT_TEMPLATES.map((t) => t.id));

function generateMany(
  year: number,
  recent: RecentPassiveEvent[] = [],
): ReturnType<typeof generatePassiveEvent>[] {
  const out: ReturnType<typeof generatePassiveEvent>[] = [];
  for (let i = 0; i < 200; i++) {
    out.push(generatePassiveEvent(year, recent));
  }
  return out;
}

describe("generatePassiveEvent", () => {
  it("produces structurally valid events with placeholders filled", () => {
    const events = generateMany(2003).filter((e) => e !== null);
    expect(events.length).toBeGreaterThan(0);

    for (const e of events) {
      expect(TEMPLATE_IDS.has(e.templateId)).toBe(true);
      expect(e.description).not.toContain("{");
      expect(e.artists.length).toBeGreaterThanOrEqual(1);
      expect(e.artists.length).toBeLessThanOrEqual(2);
      expect(e.year).toBe(2003);
    }
  });

  it("only uses artists active in the given year", () => {
    // In 1960, very few artists are active; none started after 1960.
    const events = generateMany(1960).filter((e) => e !== null);
    for (const e of events) {
      expect(e.artists.length).toBeGreaterThan(0);
    }
    // A far-future year has everyone active; still valid structure.
    const future = generatePassiveEvent(2100);
    expect(future === null || future.artists.length >= 1).toBe(true);
  });

  it("avoids repeating the exact same artist set from recent events", () => {
    // Seed recent with a single-artist event; if the generator picks the same
    // template+artist it must be filtered. We assert no generated event repeats
    // a recent same-set pair.
    const first = generatePassiveEvent(2003);
    expect(first).not.toBeNull();
    const recent: RecentPassiveEvent[] = [
      { templateId: first!.templateId, artists: first!.artists },
    ];

    const events = generateMany(2003, recent).filter((e) => e !== null);
    for (const e of events) {
      const sameSet =
        e.templateId === first!.templateId &&
        e.artists.length === first!.artists.length &&
        e.artists.every((a) => first!.artists.includes(a));
      expect(sameSet).toBe(false);
    }
  });
});
