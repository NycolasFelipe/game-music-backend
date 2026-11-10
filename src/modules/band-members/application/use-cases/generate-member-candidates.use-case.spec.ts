import { GenerateMemberCandidatesUseCase } from "@/modules/band-members/application/use-cases/generate-member-candidates.use-case";

describe("GenerateMemberCandidatesUseCase", () => {
  const useCase = new GenerateMemberCandidatesUseCase();

  it("returns the default count of candidates with temporary ids", () => {
    const result = useCase.execute();
    expect(result).toHaveLength(9);
    for (const candidate of result) {
      expect(typeof candidate.id).toBe("string");
      expect(candidate.name.length).toBeGreaterThan(0);
    }
  });

  it("gives every candidate a stored look consistent with the avatar (ADR-0023)", () => {
    for (const candidate of useCase.execute(10)) {
      expect(candidate.appearance).toEqual(
        expect.objectContaining({
          hairStyle: expect.any(String) as string,
          shirt: expect.any(String) as string,
        }),
      );
      if (candidate.avatar.includes("\u{1F9B2}")) {
        expect(candidate.appearance.hairStyle).toBe("bald");
      }
      if (candidate.gender === "female") {
        expect(candidate.appearance.beard).toBe("none");
      }
    }
  });

  it("clamps the requested count to the allowed range", () => {
    expect(useCase.execute(3)).toHaveLength(6);
    expect(useCase.execute(50)).toHaveLength(10);
    expect(useCase.execute(7)).toHaveLength(7);
  });
});
