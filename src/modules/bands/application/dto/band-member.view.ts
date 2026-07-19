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
  happiness: number;
  characteristics: string[];
  skills: Skills;
  biography: string;
  primarySkill: SkillType;
  joinYear: number | null;
}
