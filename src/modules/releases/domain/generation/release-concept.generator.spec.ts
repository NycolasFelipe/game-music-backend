import { generateReleaseConcept } from "@/modules/releases/domain/generation/release-concept.generator";

describe("release-concept.generator", () => {
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
});
