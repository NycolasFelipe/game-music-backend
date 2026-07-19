import { GenerateBandNameUseCase } from "@/modules/bands/application/use-cases/generate-band-name.use-case";

describe("GenerateBandNameUseCase", () => {
  const useCase = new GenerateBandNameUseCase();

  it("defaults to a single non-empty name", () => {
    const result = useCase.execute();

    expect(result.names).toHaveLength(1);
    expect(result.names[0].trim().length).toBeGreaterThan(0);
  });

  it("returns the requested number of unique names for the given options", () => {
    const result = useCase.execute({
      count: 5,
      language: "pt",
      includeArticle: true,
      genre: "rock",
    });

    expect(result.names.length).toBeGreaterThan(0);
    expect(result.names.length).toBeLessThanOrEqual(5);
    expect(new Set(result.names).size).toBe(result.names.length);
    for (const name of result.names) {
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });
});
