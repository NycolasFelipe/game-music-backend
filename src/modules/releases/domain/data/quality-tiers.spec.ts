import { mapQualityTier } from "@/modules/releases/domain/data/quality-tiers";

describe("quality-tiers", () => {
  it("maps a founding band's typical quality (≈27) to medíocre", () => {
    expect(mapQualityTier(27).id).toBe("mediocre");
  });

  it("keeps anything below 25 as a flop", () => {
    expect(mapQualityTier(24.9).id).toBe("fracasso");
  });

  it("starts medíocre exactly at 25", () => {
    expect(mapQualityTier(25).id).toBe("mediocre");
  });

  it("keeps the upper thresholds", () => {
    expect(mapQualityTier(55).id).toBe("solido");
    expect(mapQualityTier(75).id).toBe("grande");
    expect(mapQualityTier(90).id).toBe("obra-prima");
  });

  it("treats a non-finite quality as a flop", () => {
    expect(mapQualityTier(Number.NaN).id).toBe("fracasso");
  });
});
