import {
  BEARDS,
  GLASSES,
  HAIR_STYLES,
  SHIRTS,
  SHIRT_TONES,
} from "@/modules/band-members/domain/constants/appearance.constant";
import { generateAppearance } from "@/modules/band-members/domain/generation/appearance.generator";

/** A random source that replays the given values, then repeats the last. */
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};

describe("generateAppearance", () => {
  it("draws a bald member as bald, whatever the gender", () => {
    expect(
      generateAppearance({ gender: "male", age: 25, avatar: "👨🏽‍🦲" }).hairStyle,
    ).toBe("bald");
    expect(
      generateAppearance({ gender: "female", age: 25, avatar: "👩🏽‍🦲" }).hairStyle,
    ).toBe("bald");
  });

  it("keeps curly hair curly", () => {
    expect(
      generateAppearance({ gender: "female", age: 22, avatar: "👩🏻‍🦱" }).hairStyle,
    ).toBe("curlylong");
    for (let i = 0; i < 20; i++) {
      expect(["curly", "afro"]).toContain(
        generateAppearance({ gender: "male", age: 22, avatar: "👨🏿‍🦱" }).hairStyle,
      );
    }
  });

  it("picks straight styles by gender", () => {
    for (let i = 0; i < 30; i++) {
      expect(["long", "bob", "bun"]).toContain(
        generateAppearance({ gender: "female", age: 22, avatar: "👩🏼" })
          .hairStyle,
      );
      expect(["short", "quiff", "long", "buzz"]).toContain(
        generateAppearance({ gender: "male", age: 22, avatar: "👨🏼" }).hairStyle,
      );
    }
  });

  it("never gives a beard to women or to men under 19", () => {
    const alwaysLow = () => 0;
    expect(
      generateAppearance({ gender: "female", age: 30, avatar: "👩" }, alwaysLow)
        .beard,
    ).toBe("none");
    expect(
      generateAppearance({ gender: "male", age: 18, avatar: "👨" }, alwaysLow)
        .beard,
    ).toBe("none");
  });

  it("gives an adult man a beard when the roll is under the chance", () => {
    // hair pick, beard roll (0.1 < 0.45), beard style pick (0.5 → "full")
    const result = generateAppearance(
      { gender: "male", age: 25, avatar: "👨🏽" },
      sequence(0, 0.1, 0.5, 0.9, 0.9, 0, 0),
    );
    expect(result.beard).toBe("full");
  });

  it("maps the glasses roll to sun, round or none", () => {
    // female: hair pick, glasses roll, earring roll, shirt, tone
    const glassesFor = (roll: number) =>
      generateAppearance(
        { gender: "female", age: 25, avatar: "👩" },
        sequence(0, roll, 0.9, 0, 0),
      ).glasses;
    expect(glassesFor(0.05)).toBe("sun");
    expect(glassesFor(0.2)).toBe("round");
    expect(glassesFor(0.5)).toBe("none");
  });

  it("always returns values from the catalogs", () => {
    for (let i = 0; i < 50; i++) {
      const result = generateAppearance({
        gender: i % 2 ? "male" : "female",
        age: 16 + (i % 15),
        avatar: i % 3 ? "👨🏾" : "👩🏻‍🦱",
      });
      expect(HAIR_STYLES).toContain(result.hairStyle);
      expect(BEARDS).toContain(result.beard);
      expect(GLASSES).toContain(result.glasses);
      expect(SHIRTS).toContain(result.shirt);
      expect(SHIRT_TONES).toContain(result.shirtTone);
      expect(typeof result.earring).toBe("boolean");
    }
  });

  it("never gives a beard to a neutral member and keeps the earring chance between the two", () => {
    for (let i = 0; i < 50; i++) {
      expect(
        generateAppearance(
          { gender: "neutral", age: 28, avatar: "🧑🏽" },
          sequence(0.5, 0),
        ).beard,
      ).toBe("none");
    }
    // 0.3 is over the male chance (0.15) and under the neutral one (0.35).
    const earring = (gender: "male" | "neutral") =>
      generateAppearance({ gender, age: 28, avatar: "🧑🏽" }, sequence(0.5, 0.3))
        .earring;
    expect(earring("neutral")).toBe(true);
    expect(earring("male")).toBe(false);
  });
});
