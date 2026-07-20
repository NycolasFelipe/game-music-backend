import {
  generateReleaseTitle,
  generateReleaseTitles,
} from "@/modules/releases/domain/generation/release-title.generator";

describe("release-title.generator", () => {
  it("generates a non-empty title", () => {
    expect(generateReleaseTitle().length).toBeGreaterThan(0);
  });

  it("supports each language", () => {
    expect(generateReleaseTitle({ language: "en" }).length).toBeGreaterThan(0);
    expect(generateReleaseTitle({ language: "es" }).length).toBeGreaterThan(0);
  });

  it("generates the requested number of unique titles", () => {
    const titles = generateReleaseTitles(5);
    expect(titles.length).toBe(5);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
