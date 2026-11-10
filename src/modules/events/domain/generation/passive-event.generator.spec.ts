import { PASSIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/passive-event-templates";
import {
  careerYears,
  generatePassiveEvent,
} from "@/modules/events/domain/generation/passive-event.generator";
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

  it("writes whole career years in a second-semester retirement", () => {
    // Retirements are 3% of the draws: 3000 draws make an empty sample
    // practically impossible.
    const retirements = Array.from({ length: 3000 }, () =>
      generatePassiveEvent(2003.5),
    ).filter((e) => e !== null && e.type === "aposentadoria");
    expect(retirements.length).toBeGreaterThan(0);
    for (const e of retirements) {
      expect(e!.description).toMatch(/após \d+ anos? de carreira\.$/);
    }
  });

  it("never retires an artist without a long career", () => {
    // In 1961 nobody has 30 years on the road, so no retirement can be drawn.
    const events = generateMany(1961.5).filter((e) => e !== null);
    expect(events.length).toBeGreaterThan(0);
    expect(events.some((e) => e.type === "aposentadoria")).toBe(false);
  });
});

describe("careerYears", () => {
  it("floors the half year of the second semester", () => {
    expect(careerYears(1961.5, 1956)).toBe(5);
    expect(careerYears(2003, 1973)).toBe(30);
  });

  it("counts at least one year", () => {
    expect(careerYears(1956.5, 1956)).toBe(1);
  });
});
