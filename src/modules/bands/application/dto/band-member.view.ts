import type { MemberAppearance } from "@/modules/band-members/domain/constants/appearance.constant";
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
  /** Stored look for the portraits (ADR-0023). */
  appearance: MemberAppearance;
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
   * Whether the member is in arrears and risks leaving. The exact deadline is
   * intentionally not exposed (kept gamified).
   */
  salaryAtRisk: boolean;
  /**
   * Whether the member is in a bad mood that, kept for another advance, makes
   * them leave (ADR-0032 §5). Only the risk is exposed, like the salary.
   */
  moodAtRisk: boolean;
}
