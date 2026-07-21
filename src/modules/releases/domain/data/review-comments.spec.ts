import {
  CRITIC_COMMENTS,
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
      // Public authors read like "Name, no <platform>".
      expect(result.public[0].author).toMatch(/, no /);
    });

    it("picks distinct comments from the right band", () => {
      const result = selectReviewComments(input);
      expect(new Set(result.critic.map((c) => c.text)).size).toBe(3);
      for (const comment of result.critic) {
        expect(CRITIC_COMMENTS.excelente).toContain(comment.text);
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
});
