import {
  CRITIC_COMMENTS,
  CRITIC_OUTLETS,
  FORMAT_COMMENTS,
  PUBLIC_COMMENTS,
  PUBLIC_PLATFORMS,
  fitsYear,
  WORK_NOUNS,
  commentsForFormat,
  criticBandFor,
  publicBandFor,
  selectReviewComments,
} from "@/modules/releases/domain/data/review-comments";

describe("review-comments", () => {
  describe("bands", () => {
    it("maps critic scores to their band", () => {
      expect(criticBandFor(95)).toBe("obra_prima");
      expect(criticBandFor(90)).toBe("excelente");
      expect(criticBandFor(60)).toBe("boa");
      expect(criticBandFor(45)).toBe("mista");
      expect(criticBandFor(20)).toBe("negativa");
    });

    it("maps public scores to a band per star", () => {
      expect(publicBandFor(90)).toBe("muito_positiva");
      expect(publicBandFor(75)).toBe("positiva");
      expect(publicBandFor(60)).toBe("mista");
      expect(publicBandFor(45)).toBe("negativa");
      expect(publicBandFor(10)).toBe("muito_negativa");
    });
  });

  describe("selectReviewComments", () => {
    const input = {
      id: "release-abc",
      criticScore: 90,
      publicScore: 30,
      format: "album",
      year: 2024,
    };

    it("returns three critic and three public comments plus a format note", () => {
      const result = selectReviewComments(input);
      expect(result.critic).toHaveLength(3);
      expect(result.public).toHaveLength(3);
      expect(typeof result.format).toBe("string");
    });

    it("signs each review with an author", () => {
      const result = selectReviewComments(input);
      for (const comment of result.critic) {
        expect(comment.author.length).toBeGreaterThan(0);
      }
      // Public authors read like "Name, <where they said it>".
      expect(result.public[0].author).toMatch(/^[^,]+, \S/);
    });

    it("picks distinct comments from the right band", () => {
      const result = selectReviewComments(input);
      expect(new Set(result.critic.map((c) => c.text)).size).toBe(3);
      for (const comment of result.critic) {
        expect(commentsForFormat(CRITIC_COMMENTS.excelente, "album")).toContain(
          comment.text,
        );
      }
    });

    it("is deterministic for the same release id", () => {
      expect(selectReviewComments(input)).toEqual(selectReviewComments(input));
    });

    it("has no format note for an unknown format", () => {
      const result = selectReviewComments({ ...input, format: "mixtape" });
      expect(result.format).toBeNull();
    });
  });

  describe("comments that fit the format", () => {
    const formats = Object.keys(WORK_NOUNS);
    const pools = [
      ...Object.entries(CRITIC_COMMENTS),
      ...Object.entries(PUBLIC_COMMENTS),
    ];

    it.each(formats)(
      "leaves at least three blurbs per band for %s",
      (format) => {
        for (const [, pool] of pools) {
          expect(commentsForFormat(pool, format).length).toBeGreaterThanOrEqual(
            3,
          );
        }
      },
    );

    it.each(formats)(
      "writes the work's noun for %s, with no marker left",
      (format) => {
        for (const [, pool] of pools) {
          for (const text of commentsForFormat(pool, format)) {
            expect(text).not.toContain("{obra}");
          }
        }
      },
    );

    it("never calls a single an album nor talks about its tracks", () => {
      for (const [, pool] of pools) {
        for (const text of commentsForFormat(pool, "single")) {
          expect(text).not.toMatch(
            /\bálbum (corajoso|ambicioso|inteiro)|esse álbum|Bom álbum|faixas?\b|músicas\b/i,
          );
        }
      }
      expect(commentsForFormat(CRITIC_COMMENTS.negativa, "single")).toContain(
        "Um single corajoso: corajoso o bastante para testar a paciência de quem aperta o play.",
      );
    });

    it("keeps the single-only blurb away from the other formats", () => {
      const singleOnly =
        "O single é muito bom. Já fiquei animado para o próximo álbum.";
      expect(commentsForFormat(PUBLIC_COMMENTS.positiva, "single")).toContain(
        singleOnly,
      );
      expect(
        commentsForFormat(PUBLIC_COMMENTS.positiva, "album"),
      ).not.toContain(singleOnly);
    });
  });

  describe("era (ADR-0024)", () => {
    const years = [1960, 1983, 1999, 2010, 2024, 2050];
    const pools = [
      ...Object.values(CRITIC_COMMENTS),
      ...Object.values(PUBLIC_COMMENTS),
    ];

    it.each(years)("leaves three blurbs per band and format in %i", (year) => {
      for (const format of Object.keys(WORK_NOUNS)) {
        for (const pool of pools) {
          expect(
            commentsForFormat(pool, format, year).length,
          ).toBeGreaterThanOrEqual(3);
        }
        expect(
          commentsForFormat(
            FORMAT_COMMENTS[format === "lp" ? "album" : format],
            format,
            year,
          ).length,
        ).toBeGreaterThan(0);
      }
      expect(
        CRITIC_OUTLETS.filter((o) => fitsYear(o, year)).length,
      ).toBeGreaterThanOrEqual(3);
      expect(
        PUBLIC_PLATFORMS.filter((p) => fitsYear(p, year)).length,
      ).toBeGreaterThan(0);
    });

    it("signs a 1983 review without the internet", () => {
      for (let i = 0; i < 40; i++) {
        const result = selectReviewComments({
          id: `r-${i}`,
          criticScore: 20 + i * 2,
          publicScore: 90 - i * 2,
          format: i % 2 ? "single" : "album",
          year: 1983,
        });
        for (const c of result.critic) {
          expect(c.author).not.toMatch(/Portal|Blog|Canal|Podcast/);
        }
        for (const c of result.public) {
          expect(c.author).not.toMatch(
            /Instagram|TikTok|YouTube|Threads|Reddit|Twitter|fórum| no X$/,
          );
          expect(c.text).not.toMatch(/streaming|playlist|repeat|desfavorit/i);
        }
      }
    });

    it("calls it Twitter until 2022 and X from 2023", () => {
      const named = (name: string) =>
        PUBLIC_PLATFORMS.find((p) => p.name === name)!;
      expect(fitsYear(named("no Twitter"), 2022)).toBe(true);
      expect(fitsYear(named("no Twitter"), 2023)).toBe(false);
      expect(fitsYear(named("no X"), 2023)).toBe(true);
    });
  });
});
