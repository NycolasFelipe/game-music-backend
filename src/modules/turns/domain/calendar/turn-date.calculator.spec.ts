import {
  formatTurnDate,
  turnDate,
} from "@/modules/turns/domain/calendar/turn-date.calculator";

const ids = Array.from(
  { length: 400 },
  (_, index) => `band-${index}-${index * 7919}`,
);

describe("turnDate", () => {
  it("puts the first turn of a year between January 1 and July 31", () => {
    for (const id of ids) {
      const date = turnDate(id, 1995);
      expect(date.year).toBe(1995);
      expect(date.month).toBeGreaterThanOrEqual(1);
      expect(date.month).toBeLessThanOrEqual(7);
    }
  });

  it("puts the second turn of a year between August 1 and December 31", () => {
    for (const id of ids) {
      const date = turnDate(id, 1995.5);
      expect(date.year).toBe(1995);
      expect(date.month).toBeGreaterThanOrEqual(8);
      expect(date.month).toBeLessThanOrEqual(12);
    }
  });

  it("always moves forward from one turn to the next", () => {
    const toNumber = (d: { year: number; month: number; day: number }) =>
      d.year * 10_000 + d.month * 100 + d.day;
    for (const id of ids.slice(0, 50)) {
      for (let year = 1960; year < 2050; year += 0.5) {
        expect(toNumber(turnDate(id, year + 0.5))).toBeGreaterThan(
          toNumber(turnDate(id, year)),
        );
      }
    }
  });

  it("is stable for the same band and turn", () => {
    expect(turnDate("abc", 2003.5)).toEqual(turnDate("abc", 2003.5));
  });

  it("gives different saves different calendars", () => {
    const days = new Set(ids.map((id) => JSON.stringify(turnDate(id, 1980))));
    expect(days.size).toBeGreaterThan(100);
  });

  it("reaches the edges of each range, including February 29 in leap years", () => {
    const seen = new Set<string>();
    for (let index = 0; index < 20_000; index += 1) {
      const first = turnDate(`edge-${index}`, 1996);
      const second = turnDate(`edge-${index}`, 1996.5);
      seen.add(`${first.month}-${first.day}`);
      seen.add(`${second.month}-${second.day}`);
    }
    expect(seen.has("1-1")).toBe(true);
    expect(seen.has("2-29")).toBe(true);
    expect(seen.has("7-31")).toBe(true);
    expect(seen.has("8-1")).toBe(true);
    expect(seen.has("12-31")).toBe(true);
  });

  it("matches the vectors shared with the frontend copy", () => {
    expect(turnDate("band-1", 1995)).toEqual({ year: 1995, month: 3, day: 23 });
    expect(turnDate("band-1", 1995.5)).toEqual({
      year: 1995,
      month: 12,
      day: 31,
    });
    expect(turnDate("3f2a9c1e-0000-4000-8000-000000000000", 1968)).toEqual({
      year: 1968,
      month: 5,
      day: 16,
    });
  });
});

describe("formatTurnDate", () => {
  it("writes the long form used in headlines", () => {
    expect(formatTurnDate({ year: 1995, month: 9, day: 14 })).toBe(
      "14 de setembro de 1995",
    );
  });

  it("writes the short form used in lists", () => {
    expect(formatTurnDate({ year: 1995, month: 9, day: 14 }, "short")).toBe(
      "14 set. 1995",
    );
    expect(formatTurnDate({ year: 1995, month: 5, day: 3 }, "short")).toBe(
      "3 maio 1995",
    );
  });

  it("writes the first day of the month as 1º", () => {
    expect(formatTurnDate({ year: 1970, month: 8, day: 1 })).toBe(
      "1º de agosto de 1970",
    );
  });
});
