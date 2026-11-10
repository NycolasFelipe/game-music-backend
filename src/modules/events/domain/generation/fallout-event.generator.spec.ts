import { ACTIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/active-event-templates";
import { generateFalloutEvent } from "@/modules/events/domain/generation/fallout-event.generator";

const pair: [
  { id: string; name: string; characteristics: string[] },
  { id: string; name: string; characteristics: string[] },
] = [
  { id: "m1", name: "Ana", characteristics: [] },
  { id: "m2", name: "Beto", characteristics: [] },
];

const FALLOUT_IDS = ACTIVE_EVENT_TEMPLATES.filter(
  (template) => template.type === "confraternizacao",
).map((template) => template.id);

describe("fallout-event.generator", () => {
  afterEach(() => jest.restoreAllMocks());

  it("never repeats a trouble while another one is still unseen", () => {
    const seen = FALLOUT_IDS.slice(0, -1);
    for (let run = 0; run < 50; run += 1) {
      const event = generateFalloutEvent({
        year: 1990,
        pair,
        usedTemplateIds: [...seen].reverse(),
      });
      expect(event?.templateId).toBe(FALLOUT_IDS[FALLOUT_IDS.length - 1]);
    }
  });

  it("brings back the trouble seen longest ago once all were seen", () => {
    // Most recent first: the first template in the catalog was seen first.
    const usedTemplateIds = [...FALLOUT_IDS].reverse();
    const event = generateFalloutEvent({ year: 1990, pair, usedTemplateIds });
    expect(event?.templateId).toBe(FALLOUT_IDS[0]);
  });

  it("draws any trouble for a band that has seen none", () => {
    const seen = new Set<string>();
    for (let run = 0; run < 1000; run += 1) {
      seen.add(generateFalloutEvent({ year: 1990, pair })?.templateId ?? "");
    }
    expect(seen).toEqual(new Set(FALLOUT_IDS));
  });

  it("has enough troubles to cover a long game without repeating early", () => {
    expect(FALLOUT_IDS.length).toBeGreaterThanOrEqual(12);
  });
});
