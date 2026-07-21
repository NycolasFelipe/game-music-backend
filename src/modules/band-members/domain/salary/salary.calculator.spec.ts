import type { Skills } from "@/modules/band-members/domain/constants/skill.constant";
import {
  computePayroll,
  salaryHappinessDelta,
  salaryPatience,
  targetSalary,
} from "@/modules/band-members/domain/salary/salary.calculator";

const skillsAll = (value: number): Skills => ({
  vocal: value,
  guitar: value,
  bass: value,
  drums: value,
  piano: value,
  lyrics: value,
});

describe("salary.calculator", () => {
  describe("targetSalary", () => {
    it("returns the base for a zero-skill, trait-less, fameless member", () => {
      expect(targetSalary(skillsAll(0), [], 0)).toBe(80);
    });

    it("doubles the skill contribution at max average skill", () => {
      expect(targetSalary(skillsAll(10), [], 0)).toBe(160);
    });

    it("raises the target for a greedy member", () => {
      expect(targetSalary(skillsAll(0), ["greedy"], 0)).toBe(128);
    });

    it("lowers the target for a purist member", () => {
      expect(targetSalary(skillsAll(0), ["purist"], 0)).toBe(48);
    });

    it("applies the fame factor (half bonus at the half-fans mark)", () => {
      expect(targetSalary(skillsAll(0), [], 5000)).toBe(120);
    });

    it("ignores unknown traits (neutral multiplier)", () => {
      expect(targetSalary(skillsAll(0), ["friendly", "shy"], 0)).toBe(80);
    });
  });

  describe("salaryPatience", () => {
    it("defaults when no salary trait applies", () => {
      expect(salaryPatience(["friendly", "shy"])).toBe(3);
    });

    it("is low for a greedy member and high for a loyal one", () => {
      expect(salaryPatience(["greedy"])).toBe(1);
      expect(salaryPatience(["loyal"])).toBe(6);
    });

    it("lets the least patient trait govern", () => {
      expect(salaryPatience(["loyal", "greedy"])).toBe(1);
    });
  });

  describe("salaryHappinessDelta", () => {
    it("gives a small bonus when paid at or above target", () => {
      expect(salaryHappinessDelta(true, 400, 400)).toBe(0.15);
      expect(salaryHappinessDelta(true, 500, 400)).toBe(0.15);
    });

    it("penalizes proportionally when paid below target", () => {
      // Half the target → 0.5 shortfall × 0.5 penalty factor = -0.25/turn.
      expect(salaryHappinessDelta(true, 200, 400)).toBe(-0.25);
    });

    it("applies the full penalty when unpaid", () => {
      expect(salaryHappinessDelta(false, 400, 400)).toBe(-1);
    });
  });

  describe("computePayroll", () => {
    it("pays in order while cash lasts and leaves the rest unpaid", () => {
      const result = computePayroll(
        [
          {
            memberId: "m-1",
            name: "A",
            salary: 300,
            target: 300,
            happiness: 1,
            unpaidTurns: 0,
            patience: 3,
          },
          {
            memberId: "m-2",
            name: "B",
            salary: 400,
            target: 400,
            happiness: 0,
            unpaidTurns: 2,
            patience: 3,
          },
        ],
        300,
      );

      expect(result.totalDue).toBe(700);
      expect(result.totalPaid).toBe(300);
      expect(result.fullyPaid).toBe(false);

      const [first, second] = result.outcomes;
      expect(first).toMatchObject({
        paid: true,
        amountPaid: 300,
        newHappiness: 1.15,
        newUnpaidTurns: 0,
        departed: false,
        turnsUntilDeparture: 0,
      });
      expect(second).toMatchObject({
        paid: false,
        amountPaid: 0,
        newHappiness: -1,
        newUnpaidTurns: 3,
        departed: true,
        turnsUntilDeparture: 0,
      });
    });

    it("warns before departure while within the member's patience", () => {
      const result = computePayroll(
        [
          {
            memberId: "m-1",
            name: "Leal",
            salary: 200,
            target: 200,
            happiness: 0,
            unpaidTurns: 0,
            patience: 6, // loyal
          },
        ],
        0, // no cash → unpaid
      );

      expect(result.outcomes[0]).toMatchObject({
        paid: false,
        newUnpaidTurns: 1,
        departed: false,
        turnsUntilDeparture: 5, // 6 - 1
      });
    });

    it("makes an impatient member leave after a single unpaid turn", () => {
      const result = computePayroll(
        [
          {
            memberId: "m-1",
            name: "Ganancioso",
            salary: 200,
            target: 200,
            happiness: 0,
            unpaidTurns: 0,
            patience: 1, // greedy
          },
        ],
        0,
      );

      expect(result.outcomes[0]).toMatchObject({
        paid: false,
        newUnpaidTurns: 1,
        departed: true,
      });
    });

    it("pays everyone when cash covers the full payroll", () => {
      const result = computePayroll(
        [
          {
            memberId: "m-1",
            name: "A",
            salary: 100,
            target: 100,
            happiness: 0,
            unpaidTurns: 1,
            patience: 3,
          },
          {
            memberId: "m-2",
            name: "B",
            salary: 200,
            target: 200,
            happiness: 0,
            unpaidTurns: 0,
            patience: 3,
          },
        ],
        1000,
      );

      expect(result.totalPaid).toBe(300);
      expect(result.fullyPaid).toBe(true);
      expect(
        result.outcomes.every((o) => o.paid && o.newUnpaidTurns === 0),
      ).toBe(true);
    });

    it("handles an empty band", () => {
      const result = computePayroll([], 500);
      expect(result).toEqual({
        totalDue: 0,
        totalPaid: 0,
        fullyPaid: true,
        outcomes: [],
      });
    });
  });
});
