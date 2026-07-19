import { GenerateBandNameUseCase } from "@/modules/bands/application/use-cases/generate-band-name.use-case";

describe("GenerateBandNameUseCase", () => {
  const useCase = new GenerateBandNameUseCase();

  it("returns a non-empty generated name", () => {
    const result = useCase.execute();

    expect(typeof result.name).toBe("string");
    expect(result.name.trim().length).toBeGreaterThan(0);
  });
});
