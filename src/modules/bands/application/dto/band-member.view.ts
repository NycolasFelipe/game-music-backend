import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * Public view of a band member returned as part of a band.
 */
export class BandMemberView {
  id: string;
  bandId: string;
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  happiness: number;
  characteristics: string[];
  skills: Skills;
  biography: string;
  primarySkill: SkillType;
  joinYear: number | null;
  /** Current salary paid per turn (ADR-0010). */
  salary: number;
  /** Salary that keeps the member content, from skill/traits/fame. */
  salaryTarget: number;
  /** Consecutive turns the member went unpaid (arrears counter). */
  salaryUnpaidTurns: number;
  /**
   * Turns left before the member leaves over unpaid salary, or `null` when not
   * in arrears (paid). A warning while `>= 1`.
   */
  salaryTurnsUntilDeparture: number | null;
}
