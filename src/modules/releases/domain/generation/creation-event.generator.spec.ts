import {
  generateCreationEvents,
  type CreationEventMemberInput,
} from "@/modules/releases/domain/generation/creation-event.generator";

const member = (
  id: string,
  name: string,
  characteristics: string[] = [],
): CreationEventMemberInput => ({ id, name, characteristics });

describe("creation-event.generator", () => {
  afterEach(() => jest.restoreAllMocks());

  it("produces no events for drama-free, trait-neutral members", () => {
    const events = generateCreationEvents(
      [member("m1", "Ana"), member("m2", "Bia")],
      [{ memberAId: "m1", memberBId: "m2", level: 3 }],
    );
    expect(events).toHaveLength(0);
  });

  it("spawns a wild-idea event for a triggering trait", () => {
    const events = generateCreationEvents(
      [member("m1", "Ana", ["creative"])],
      [],
    );
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe("ideia_maluca");
    expect(events[0].sequence).toBe(0);
    expect(events[0].options).toHaveLength(2);
    // The gamble option must be probabilistic.
    expect(events[0].options[0].effect.type).toBe("probabilistic");
  });

  it("spawns a vision conflict for members who dislike each other", () => {
    const events = generateCreationEvents(
      [member("m1", "Ana"), member("m2", "Bia")],
      [{ memberAId: "m1", memberBId: "m2", level: -3 }],
    );
    expect(events.some((e) => e.kind === "conflito_visao")).toBe(true);
    const conflict = events.find((e) => e.kind === "conflito_visao");
    expect(conflict?.prompt).toContain("Ana");
    expect(conflict?.prompt).toContain("Bia");
  });

  it.each(["creative", "experimental", "visionary", "erratic", "genius"])(
    "tunes the %s gamble to an expected modifier of at least ~1",
    (trait) => {
      const [event] = generateCreationEvents(
        [member("m1", "Ana", [trait])],
        [],
      );
      const effect = event.options[0].effect;
      if (effect.type !== "probabilistic") {
        throw new Error("expected a gamble");
      }
      const expected =
        effect.successChance * effect.successModifier +
        (1 - effect.successChance) * effect.failureModifier;
      expect(expected).toBeGreaterThanOrEqual(0.998);
      expect(expected).toBeLessThanOrEqual(1.06);
    },
  );

  it("charges extra studio time to let the perfectionist polish", () => {
    const [event] = generateCreationEvents(
      [member("m1", "Ana", ["perfectionist"])],
      [],
    );
    const polish = event.options.find((o) => o.id === "caprichar");
    const stop = event.options.find((o) => o.id === "chega");
    expect(polish?.cost).toEqual({ extraProductionTurns: 1 });
    expect(stop?.cost).toEqual({
      happiness: [{ memberId: "m1", delta: -1 }],
    });
  });

  it("makes the lazy member unhappy when the studio insists", () => {
    const [event] = generateCreationEvents([member("m1", "Ana", ["lazy"])], []);
    const insist = event.options.find((o) => o.id === "insistir");
    const cut = event.options.find((o) => o.id === "cortar");
    expect(insist?.cost).toEqual({
      happiness: [{ memberId: "m1", delta: -2 }],
    });
    expect(cut?.cost).toBeUndefined();
  });

  it("charges the losing side of a vision conflict", () => {
    const events = generateCreationEvents(
      [member("m1", "Ana"), member("m2", "Bia")],
      [{ memberAId: "m1", memberBId: "m2", level: -3 }],
    );
    const conflict = events.find((e) => e.kind === "conflito_visao");
    const sideA = conflict?.options.find((o) => o.id === "lado_a");
    const sideB = conflict?.options.find((o) => o.id === "lado_b");
    const middle = conflict?.options.find((o) => o.id === "meio_termo");
    const rift = [{ memberAId: "m1", memberBId: "m2", delta: -1 }];
    expect(sideA?.cost).toEqual({
      happiness: [{ memberId: "m2", delta: -1 }],
      relationships: rift,
    });
    expect(sideB?.cost).toEqual({
      happiness: [{ memberId: "m1", delta: -1 }],
      relationships: rift,
    });
    expect(middle?.cost).toBeUndefined();
  });

  it("caps the number of events at the maximum", () => {
    const events = generateCreationEvents(
      [
        member("m1", "Ana", ["creative"]),
        member("m2", "Bia", ["perfectionist"]),
        member("m3", "Cid", ["lazy"]),
        member("m4", "Dan", ["experimental"]),
        member("m5", "Eva", ["genius"]),
      ],
      [{ memberAId: "m1", memberBId: "m2", level: -2 }],
    );
    expect(events.length).toBeLessThanOrEqual(3);
    events.forEach((e, i) => expect(e.sequence).toBe(i));
  });
});
