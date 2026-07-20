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
