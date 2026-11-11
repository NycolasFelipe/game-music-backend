import { seededRandom } from "@/common/language/testing/agreement-checker";
import { generateReleaseConcept } from "@/modules/releases/domain/generation/release-concept.generator";

/** Preposition followed by an article that Portuguese requires to fuse. */
const UNCONTRACTED = /\b(em|de|por) (o|a|os|as) |\ba (o|a|os|as) /;

/**
 * Generates a deterministic sample of concepts, half of them with seeds.
 *
 * @returns The generated concepts.
 */
function sample(): string[] {
  jest.spyOn(Math, "random").mockImplementation(seededRandom(20261110));
  const concepts = Array.from({ length: 2000 }, (_, i) =>
    generateReleaseConcept(
      i % 2 === 0 ? {} : { title: "Cinzas", styleLabel: "Grunge" },
    ),
  );
  jest.restoreAllMocks();
  return concepts;
}

describe("release-concept.generator", () => {
  afterEach(() => jest.restoreAllMocks());

  it("generates a non-empty concept", () => {
    expect(generateReleaseConcept().length).toBeGreaterThan(0);
  });

  it("weaves in the title and style label when given", () => {
    const concept = generateReleaseConcept({
      title: "Cinzas",
      styleLabel: "Grunge",
    });
    expect(concept).toContain("Cinzas");
    expect(concept).toContain("Grunge");
  });

  it("fuses every preposition with the theme's article", () => {
    const concepts = sample();
    expect(concepts.filter((c) => UNCONTRACTED.test(c))).toEqual([]);
    const has = (re: RegExp) => concepts.some((c) => re.test(c));
    expect(has(/Uma ode à /)).toBe(true);
    expect(has(/uma ode aos fantasmas/)).toBe(true);
    expect(has(/mergulho na solidão/)).toBe(true);
    expect(has(/jornada pelas ruínas/)).toBe(true);
    expect(has(/retrato do fim de um amor/)).toBe(true);
    expect(has(/sobre o que ficou para trás/)).toBe(true);
  });

  it("starts with a capital letter and never addresses the player", () => {
    const concepts = sample();
    expect(concepts.filter((c) => !/^["A-ZÀ-Ú]/.test(c))).toEqual([]);
    expect(concepts.filter((c) => /\bvocês?\b/i.test(c))).toEqual([]);
  });
});
