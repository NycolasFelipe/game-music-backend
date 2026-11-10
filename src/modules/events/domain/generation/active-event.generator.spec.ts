import { ACTIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/active-event-templates";
import {
  fillTemplate,
  generateActiveEvent,
  instantiateActiveEvent,
} from "@/modules/events/domain/generation/active-event.generator";
import type {
  EventCharacter,
  EventRelationship,
  GeneratedActiveEvent,
} from "@/modules/events/domain/generation/generated-active-event";

const characters: EventCharacter[] = [
  { id: "m1", name: "Ana", characteristics: ["creative", "professional"] },
  { id: "m2", name: "Bia", characteristics: ["plagiarist", "hothead"] },
];
const relationships: EventRelationship[] = [
  { memberAId: "m1", memberBId: "m2", level: 0 },
];

function generateMany(overrides?: {
  fanCount?: number;
  recent?: Set<string>;
}): GeneratedActiveEvent[] {
  const results: GeneratedActiveEvent[] = [];
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
    const recent = new Set(ACTIVE_EVENT_TEMPLATES.map((t) => t.id));
    const events = generateMany({ recent });
    expect(events).toHaveLength(0);
  });

  it("excludes a pair whose relationship level exceeds maxRelationshipLevel", () => {
    // Every template but 0001 is marked recent, so only 0001 can be drawn, and
    // it requires the pair's relationship level <= 3. A level of 4 must make it
    // ineligible.
    const recent = new Set(
      ACTIVE_EVENT_TEMPLATES.map((t) => t.id).filter(
        (id) => id !== "0001-melodia-familiar",
      ),
    );
    for (let i = 0; i < 100; i++) {
      const e = generateActiveEvent({
        year: 2003,
        characters,
        relationships: [{ memberAId: "m1", memberBId: "m2", level: 4 }],
        fanCount: 200,
        recentTemplateIds: recent,
      });
      expect(e).toBeNull();
    }
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

  describe("gender inflection (ADR-0027)", () => {
    const cast = (gender: "male" | "female" | "neutral") => [
      { id: "a", name: "Ana", characteristics: [], gender },
      { id: "b", name: "Beto", characteristics: [], gender: "male" as const },
    ];
    const text =
      "{character1} passa a noite {character1:calado|calada|em silêncio}.";

    it("picks the form by the gender of the character it refers to", () => {
      expect(fillTemplate(text, cast("male"))).toBe(
        "Ana passa a noite calado.",
      );
      expect(fillTemplate(text, cast("female"))).toBe(
        "Ana passa a noite calada.",
      );
      expect(fillTemplate(text, cast("neutral"))).toBe(
        "Ana passa a noite em silêncio.",
      );
    });

    it("falls back to the uninflected form when the gender is unknown", () => {
      expect(
        fillTemplate(text, [{ id: "a", name: "Ana", characteristics: [] }]),
      ).toBe("Ana passa a noite em silêncio.");
    });

    it("inflects result labels too", () => {
      const event = instantiateActiveEvent(
        {
          id: "x",
          type: "",
          title: "Teste",
          descriptionTemplate: "{character1} e {character2}.",
          requiredCharacters: 2,
          options: [
            {
              label: "Ok",
              description: "Ok",
              consequence: {
                resultLabel: "{character1:Exposto|Exposta|Exposição}",
                descriptionTemplate: "Fim.",
              },
            },
          ],
        },
        cast("female"),
        1990,
      );
      const consequence = event?.options[0].consequence;
      expect(
        Array.isArray(consequence) ? undefined : consequence?.resultLabel,
      ).toBe("Exposta");
    });
  });

  describe("cast selection (ADR-0028)", () => {
    const ids = ["a", "b", "c", "d", "e"];
    const characters = ids.map((id) => ({
      id,
      name: id.toUpperCase(),
      characteristics: [],
    }));
    // Every pair at +5 except a feud between a and b.
    const relationships = ids.flatMap((x, i) =>
      ids.slice(i + 1).map((y) => ({
        memberAId: x,
        memberBId: y,
        level: x === "a" && y === "b" ? -5 : 5,
      })),
    );
    const pairTemplate = (
      type: "conflito_membros" | "oportunidade_externa",
    ) => ({
      id: `t-${type}`,
      type,
      title: "T",
      descriptionTemplate: "{character1} e {character2}.",
      requiredCharacters: 2 as const,
      options: [
        {
          label: "Ok",
          description: "Ok",
          consequence: { descriptionTemplate: "Fim." },
        },
      ],
    });
    const feudShare = (
      type: "conflito_membros" | "oportunidade_externa",
      lastInvolvedIds: string[] = [],
    ) => {
      const spy = jest
        .spyOn(ACTIVE_EVENT_TEMPLATES, "filter")
        .mockReturnValue([pairTemplate(type)]);
      let feud = 0;
      const runs = 3000;
      for (let i = 0; i < runs; i++) {
        const event = generateActiveEvent({
          year: 1990,
          characters,
          relationships,
          fanCount: 5000,
          lastInvolvedIds,
        });
        const pair = [...(event?.involvedCharacterIds ?? [])].sort().join("");
        if (pair === "ab") feud++;
      }
      spy.mockRestore();
      return feud / runs;
    };

    it("leans member conflicts toward the feuding pair without giving it every fight", () => {
      // Weight 6 for the feud against 1 for each of the other nine pairs: 6/15.
      expect(feudShare("conflito_membros")).toBeGreaterThan(0.33);
      expect(feudShare("conflito_membros")).toBeLessThan(0.47);
    });

    it("draws any pair evenly for other event types", () => {
      expect(feudShare("oportunidade_externa")).toBeGreaterThan(0.06);
      expect(feudShare("oportunidade_externa")).toBeLessThan(0.14);
    });

    it("gives the pair of the previous event less room", () => {
      // The feud weighs 6 × 0.25 = 1.5; the six pairs with a or b weigh 0.5
      // each (3) and the three others 1 each (3): 1.5 / 7.5 = 20%, half the
      // 40% it gets without rotation.
      const share = feudShare("conflito_membros", ["a", "b"]);
      expect(share).toBeGreaterThan(0.14);
      expect(share).toBeLessThan(0.26);
    });
  });
});
