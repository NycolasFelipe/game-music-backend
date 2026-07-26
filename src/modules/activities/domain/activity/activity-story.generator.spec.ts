import {
  formatNames,
  generateActivityStory,
} from "@/modules/activities/domain/activity/activity-story.generator";
import { findActivity } from "@/modules/activities/domain/data/activities";
import {
  ACTIVITY_GOOD_CLOSINGS,
  ACTIVITY_TROUBLE_CLOSINGS,
} from "@/modules/activities/domain/data/activity-scenes";

const festa = findActivity("festa")!;

const base = {
  activity: festa,
  participantNames: ["Ana", "Beto", "Caio"],
  weakestPair: null,
  trouble: false,
  saturation: 1,
  seed: 0.42,
};

describe("formatNames", () => {
  it("joins names the way a person would", () => {
    expect(formatNames(["Ana", "Beto", "Caio"])).toBe("Ana, Beto e Caio");
    expect(formatNames(["Ana"])).toBe("Ana");
    expect(formatNames([])).toBe("a banda");
  });
});

describe("generateActivityStory", () => {
  it("opens with the guest list and closes on how it went", () => {
    const story = generateActivityStory(base);

    expect(story).toHaveLength(3);
    expect(story[0]).toContain("Ana, Beto e Caio");
    expect(story[0]).not.toContain("{");
  });

  it("tells the tense pair's story when hostility was invited", () => {
    const story = generateActivityStory({
      ...base,
      weakestPair: { a: "Ana", b: "Beto", level: -4 },
    });

    expect(story[1]).toContain("Ana");
    expect(story[1]).toContain("Beto");
  });

  it("ends differently when the night went wrong", () => {
    const good = generateActivityStory(base);
    const bad = generateActivityStory({ ...base, trouble: true });

    // The closing is the only beat that knows how the night turned out, and it
    // is what hands the player over to the decision that is waiting.
    expect(ACTIVITY_GOOD_CLOSINGS).toContain(good.at(-1));
    expect(ACTIVITY_TROUBLE_CLOSINGS).toContain(bad.at(-1));
  });

  it("adds a beat when the turn had already seen one", () => {
    const first = generateActivityStory(base);
    const second = generateActivityStory({ ...base, saturation: 0.5 });

    expect(second).toHaveLength(first.length + 1);
  });

  it("is deterministic for the same seed", () => {
    expect(generateActivityStory(base)).toEqual(generateActivityStory(base));
  });

  it("does not tell the same night twice", () => {
    const openings = new Set(
      Array.from(
        { length: 40 },
        (_, index) => generateActivityStory({ ...base, seed: index / 40 })[0],
      ),
    );

    // A get-together bought many times over a campaign has to stop reading the
    // same way, or it stops feeling like a night out.
    expect(openings.size).toBeGreaterThanOrEqual(4);
  });

  it("never leaves a placeholder unfilled, whoever went", () => {
    for (const seed of [0, 0.13, 0.5, 0.77, 0.99]) {
      const story = generateActivityStory({
        ...base,
        weakestPair: { a: "Ana", b: "Beto", level: 4 },
        seed,
      });
      expect(story.join(" ")).not.toMatch(/[{}]/);
    }
  });
});
