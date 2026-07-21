/**
 * Salary rules (ADR-0010). A member's salary is a per-turn (semester) cost paid
 * from the band's cash on every {@link AdvanceTurn}. All values are starting
 * constants and need balancing by playtesting.
 */

/** Absolute salary bounds (the manual-adjust validation range). */
export const SALARY_MIN = 0;
export const SALARY_MAX = 1_000_000;

/**
 * Base target salary (per turn) before skill/fame/trait modifiers. Tuned so an
 * early band (low skill, few fans) can carry its payroll from a modest release
 * cadence plus the starting capital, while still bleeding cash if it sits idle —
 * the pressure that makes cash management matter. Established bands out-earn it
 * easily (release income scales with fame far faster than the target does).
 */
export const SALARY_BASE = 80;

/**
 * How strongly average skill scales the target: at max average skill the target
 * doubles the base contribution (factor 1..2 over `avgSkill / SKILL_MAX`).
 */
export const SALARY_SKILL_WEIGHT = 1;

/** Maximum fame bonus to the target (factor approaches 1 + this as fans grow). */
export const SALARY_FAME_MAX_BONUS = 1;
/** Fan count at which the fame bonus reaches half of its maximum (asymptote). */
export const SALARY_FAME_HALF_FANS = 5000;

/**
 * Per-trait multipliers applied to the salary target (product of the matches a
 * member has). Traits not listed are neutral (×1). Opposite traits never
 * coexist (catalog invariant), so contradictory expectations cannot combine.
 */
export const SALARY_TRAIT_MULTIPLIERS: Readonly<Record<string, number>> = {
  greedy: 1.6, // Ganancioso — demands much more to stay content
  dazzled: 1.3, // Deslumbrado — fame went to their head
  professional: 1.1, // values proper compensation
  romantic: 0.85, // cares less about money
  spiritual: 0.7, // cares little about money
  purist: 0.6, // rejects commercial success
};

/** Consecutive unpaid turns after which a member leaves the band. */
export const SALARY_ARREARS_LIMIT = 3;

/** Happiness gained when a member is paid at or above their target. */
export const SALARY_PAID_HAPPINESS_BONUS = 0.15;
/**
 * Happiness lost per unit of relative shortfall (0..1) when paid below target.
 * A slow burn: paying half the target erodes ~0.25 happiness/turn, recoverable
 * by raising the salary — not a cliff.
 */
export const SALARY_UNDERPAY_HAPPINESS_PENALTY = 0.5;
/** Happiness lost when the band cannot pay the member at all this turn. */
export const SALARY_UNPAID_HAPPINESS_PENALTY = 1;

/** Reason recorded on a salary agreement (audit log in `member_salaries`). */
export type SalaryChangeReason = "inicial" | "ajuste";
