import {
  HAPPINESS_MAX,
  HAPPINESS_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  SALARY_BASE,
  SALARY_DEFAULT_PATIENCE,
  SALARY_FAME_HALF_FANS,
  SALARY_FAME_MAX_BONUS,
  SALARY_MAX,
  SALARY_MIN,
  SALARY_PAID_HAPPINESS_BONUS,
  SALARY_SKILL_WEIGHT,
  SALARY_TRAIT_MULTIPLIERS,
  SALARY_TRAIT_PATIENCE,
  SALARY_UNDERPAY_HAPPINESS_PENALTY,
  SALARY_UNPAID_HAPPINESS_PENALTY,
} from "@/modules/band-members/domain/constants/salary.constant";
import {
  SKILL_MAX,
  SKILL_TYPES,
  type Skills,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * Salary domain calculations (ADR-0010) — pure functions, mockable via their
 * inputs (no `Math.random`). Cover the salary target, the per-turn happiness
 * reaction and the payroll run.
 */

/**
 * Rounds to two decimals (money/happiness precision used across the domain).
 *
 * @param value - The value to round.
 * @returns The value rounded to two decimals.
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Clamps a value into an inclusive range.
 *
 * @param value - The value to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns The clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes a member's target salary from skill, personality and band fame
 * (ADR-0010 §2). The target is the salary that keeps the member content; paying
 * below it erodes happiness.
 *
 * @param skills - The member's six skills (0..10 each).
 * @param characteristics - The member's trait ids (drive the trait multiplier).
 * @param fanCount - The band's current fan count (fame factor).
 * @returns The target salary, clamped to `[SALARY_MIN, SALARY_MAX]`.
 */
export function targetSalary(
  skills: Skills,
  characteristics: string[],
  fanCount: number,
): number {
  const avgSkill =
    SKILL_TYPES.reduce((sum, key) => sum + skills[key], 0) / SKILL_TYPES.length;
  const skillFactor = 1 + SALARY_SKILL_WEIGHT * (avgSkill / SKILL_MAX);

  const fans = Math.max(0, fanCount);
  const fameFactor =
    1 + SALARY_FAME_MAX_BONUS * (fans / (fans + SALARY_FAME_HALF_FANS));

  const traitFactor = characteristics.reduce(
    (mult, id) => mult * (SALARY_TRAIT_MULTIPLIERS[id] ?? 1),
    1,
  );

  const target = SALARY_BASE * skillFactor * fameFactor * traitFactor;
  return clamp(round2(target), SALARY_MIN, SALARY_MAX);
}

/**
 * How many consecutive unpaid turns a member tolerates before leaving, from
 * their personality (ADR-0010 §6). The least patient matching trait governs;
 * with no matching trait, the default applies.
 *
 * @param characteristics - The member's trait ids.
 * @returns The member's salary patience, in turns.
 */
export function salaryPatience(characteristics: string[]): number {
  const values = characteristics
    .map((id) => SALARY_TRAIT_PATIENCE[id])
    .filter((value): value is number => value !== undefined);
  return values.length > 0 ? Math.min(...values) : SALARY_DEFAULT_PATIENCE;
}

/**
 * Computes the happiness delta a member feels for how they were paid this turn
 * (ADR-0010 §5).
 *
 * @param paid - Whether the band could pay the member this turn.
 * @param salary - The member's salary (amount owed this turn).
 * @param target - The member's target salary.
 * @returns The happiness delta (negative when unpaid/underpaid).
 */
export function salaryHappinessDelta(
  paid: boolean,
  salary: number,
  target: number,
): number {
  if (!paid) {
    return -SALARY_UNPAID_HAPPINESS_PENALTY;
  }
  if (target <= 0 || salary >= target) {
    return SALARY_PAID_HAPPINESS_BONUS;
  }
  const shortfall = (target - salary) / target; // 0..1
  return round2(-shortfall * SALARY_UNDERPAY_HAPPINESS_PENALTY);
}

/** One member's payroll inputs for a turn. */
export interface PayrollMemberInput {
  memberId: string;
  /** The member's name (for timeline records on departure). */
  name: string;
  /** Salary owed this turn. */
  salary: number;
  /** Target salary (for the happiness reaction). */
  target: number;
  /** Current absolute happiness. */
  happiness: number;
  /** Consecutive unpaid turns so far. */
  unpaidTurns: number;
  /** Unpaid turns the member tolerates before leaving (from their traits). */
  patience: number;
}

/** One member's payroll outcome for a turn. */
export interface PayrollMemberOutcome {
  memberId: string;
  /** The member's name. */
  name: string;
  /** Salary owed this turn. */
  salary: number;
  /** Whether the member was paid this turn. */
  paid: boolean;
  /** Amount actually paid (equals `salary` when paid, else 0). */
  amountPaid: number;
  /** New absolute happiness after the reaction (clamped). */
  newHappiness: number;
  /** New consecutive-unpaid-turns counter (0 when paid). */
  newUnpaidTurns: number;
  /** Whether the member leaves the band this turn (patience reached). */
  departed: boolean;
  /**
   * Turns left before the member leaves if still unpaid. `0` when paid or
   * already departed; `>= 1` while in arrears (the warning window).
   */
  turnsUntilDeparture: number;
}

/** The result of running a band's payroll for a turn. */
export interface PayrollResult {
  /** Sum of all salaries owed this turn. */
  totalDue: number;
  /** Sum actually paid from the available cash. */
  totalPaid: number;
  /** Whether every member was paid in full. */
  fullyPaid: boolean;
  /** Per-member outcomes (same order as the input). */
  outcomes: PayrollMemberOutcome[];
}

/**
 * Runs a band's payroll for a turn (ADR-0010 §4-6): pays each member in order,
 * in full, while cash remains; members the cash cannot cover go unpaid (arrears
 * increment, larger happiness penalty) and leave once the arrears limit is hit.
 * The payroll never drives cash negative.
 *
 * @param members - The members to pay, in the order they should be paid.
 * @param availableCash - The cash available to the band this turn.
 * @returns The payroll result (totals plus per-member outcomes).
 */
export function computePayroll(
  members: PayrollMemberInput[],
  availableCash: number,
): PayrollResult {
  let cash = availableCash;
  let totalDue = 0;
  let totalPaid = 0;
  let fullyPaid = true;

  const outcomes = members.map((member) => {
    totalDue = round2(totalDue + member.salary);
    const paid = member.salary <= cash;

    let amountPaid = 0;
    let newUnpaidTurns = member.unpaidTurns;
    if (paid) {
      amountPaid = member.salary;
      cash = round2(cash - member.salary);
      totalPaid = round2(totalPaid + member.salary);
      newUnpaidTurns = 0;
    } else {
      fullyPaid = false;
      newUnpaidTurns = member.unpaidTurns + 1;
    }

    const delta = salaryHappinessDelta(paid, member.salary, member.target);
    const newHappiness = clamp(
      round2(member.happiness + delta),
      HAPPINESS_MIN,
      HAPPINESS_MAX,
    );
    const departed = newUnpaidTurns >= member.patience;
    const turnsUntilDeparture =
      paid || departed ? 0 : member.patience - newUnpaidTurns;

    return {
      memberId: member.memberId,
      name: member.name,
      salary: member.salary,
      paid,
      amountPaid,
      newHappiness,
      newUnpaidTurns,
      departed,
      turnsUntilDeparture,
    };
  });

  return { totalDue, totalPaid, fullyPaid, outcomes };
}
