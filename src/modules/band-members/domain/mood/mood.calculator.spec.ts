import {
  DEPARTURE_FAN_LOSS,
  MOOD_DEPARTURE_THRESHOLD,
  MOOD_DEPARTURE_TURNS,
} from "@/modules/band-members/domain/constants/mood.constant";
import {
  computeMoodTick,
  driftedHappiness,
  fansAfterDepartures,
} from "@/modules/band-members/domain/mood/mood.calculator";

describe("mood.calculator (ADR-0032)", () => {
  describe("driftedHappiness", () => {
    it("moves happiness 5% of the way back to neutral, from either side", () => {
      expect(driftedHappiness(4)).toBe(3.8);
      expect(driftedHappiness(-2)).toBe(-1.9);
      expect(driftedHappiness(0)).toBe(0);
    });

    it("never leaves the -5..5 scale", () => {
      expect(driftedHappiness(5)).toBe(4.75);
      expect(driftedHappiness(-5)).toBe(-4.75);
    });
  });

  describe("computeMoodTick", () => {
    it("counts a bad turn and flags the risk before anyone leaves", () => {
      const [outcome] = computeMoodTick([
        { memberId: "m1", happiness: -5, lowMoodTurns: 0 },
      ]);

      expect(outcome).toEqual({
        memberId: "m1",
        newHappiness: -4.75,
        newLowMoodTurns: 1,
        departed: false,
        atRisk: true,
      });
    });

    it(`lets a member go after ${MOOD_DEPARTURE_TURNS} bad turns in a row`, () => {
      const [outcome] = computeMoodTick([
        {
          memberId: "m1",
          happiness: -4.5,
          lowMoodTurns: MOOD_DEPARTURE_TURNS - 1,
        },
      ]);

      expect(outcome.departed).toBe(true);
      expect(outcome.atRisk).toBe(false);
    });

    it("judges the mood after the drift, so a member just at the line recovers", () => {
      // -4.1 drifts to -3.9, above the threshold: the streak resets.
      const [outcome] = computeMoodTick([
        { memberId: "m1", happiness: -4.1, lowMoodTurns: 1 },
      ]);

      expect(outcome.newHappiness).toBeGreaterThan(MOOD_DEPARTURE_THRESHOLD);
      expect(outcome.newLowMoodTurns).toBe(0);
      expect(outcome.departed).toBe(false);
      expect(outcome.atRisk).toBe(false);
    });

    it("keeps the order of the members", () => {
      const outcomes = computeMoodTick([
        { memberId: "a", happiness: 1, lowMoodTurns: 0 },
        { memberId: "b", happiness: -5, lowMoodTurns: 1 },
      ]);

      expect(outcomes.map((o) => o.memberId)).toEqual(["a", "b"]);
      expect(outcomes.map((o) => o.departed)).toEqual([false, true]);
    });
  });

  describe("fansAfterDepartures", () => {
    it(`costs ${DEPARTURE_FAN_LOSS * 100}% of the fans per departure, compounding`, () => {
      expect(fansAfterDepartures(1000, 1)).toBe(900);
      expect(fansAfterDepartures(1000, 2)).toBe(810);
    });

    it("leaves the fans alone when no one leaves", () => {
      expect(fansAfterDepartures(1000, 0)).toBe(1000);
    });

    it("never drops below one fan nor creates one from nothing", () => {
      expect(fansAfterDepartures(3, 5)).toBe(2);
      expect(fansAfterDepartures(2, 30)).toBe(1);
      expect(fansAfterDepartures(0, 1)).toBe(0);
    });
  });
});
