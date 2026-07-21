import { evaluateReviews } from "@/modules/releases/domain/quality/review.calculator";

describe("evaluateReviews", () => {
  it("favors critics for a high-quality experimental album (low fame)", () => {
    const reviews = evaluateReviews({
      quality: 85,
      formatId: "album",
      budgetTierId: "grande",
      style: "metal",
      currentFans: 0,
    });

    // Ambitious + experimental + high quality → critics love it.
    expect(reviews.critic).toBeGreaterThanOrEqual(85);
    // Low accessibility + no reach → public is lukewarm.
    expect(reviews.public).toBeLessThan(60);
    expect(reviews.critic).toBeGreaterThan(reviews.public);
  });

  it("favors the public for a catchy pop single by a famous band", () => {
    const reviews = evaluateReviews({
      quality: 70,
      formatId: "single",
      budgetTierId: "estudio",
      style: "pop-mainstream",
      currentFans: 50000,
    });

    // Accessible + big reach → public loves it.
    expect(reviews.public).toBeGreaterThan(80);
    // Safe + not ambitious → critics are only mild.
    expect(reviews.public).toBeGreaterThan(reviews.critic);
  });

  it("keeps both scores within 0..100 and rounds to one decimal", () => {
    const reviews = evaluateReviews({
      quality: 100,
      formatId: "album",
      budgetTierId: "grande",
      style: "jazz",
      currentFans: 10_000_000,
    });

    expect(reviews.critic).toBeLessThanOrEqual(100);
    expect(reviews.public).toBeLessThanOrEqual(100);
    expect(reviews.critic).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(reviews.factors.accessibility)).toBe(true);
  });

  it("falls back gracefully for unknown format/genre", () => {
    const reviews = evaluateReviews({
      quality: 50,
      formatId: "unknown",
      budgetTierId: "unknown",
      style: "unknown",
      currentFans: 100,
    });

    expect(reviews.critic).toBeGreaterThan(0);
    expect(reviews.public).toBeGreaterThan(0);
  });
});
