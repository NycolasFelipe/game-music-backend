import { BAND_THEMES } from "@/modules/bands/domain/constants/band.constant";
import { THEME_DESCRIPTIONS } from "@/modules/bands/presentation/http/constants/theme-descriptions.constant";

describe("THEME_DESCRIPTIONS (ADR-0030)", () => {
  it.each([...BAND_THEMES])("describes %s in a short line", (theme) => {
    const text = THEME_DESCRIPTIONS[theme];
    expect(text.trim().length).toBeGreaterThan(0);
    // Fits under the style picker without turning into a paragraph.
    expect(text.length).toBeLessThanOrEqual(160);
  });

  it.each([...BAND_THEMES])(
    "keeps %s free of slash inflection and of talking to the player (ADR-0026)",
    (theme) => {
      const text = THEME_DESCRIPTIONS[theme];
      expect(text).not.toMatch(/\((a|o)\)/);
      expect(text).not.toMatch(/\bvocê\b/i);
    },
  );
});
