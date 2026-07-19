import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * A freshly generated band member (candidate), not yet persisted nor attached
 * to a band.
 */
export interface GeneratedBandMember {
  name: string;
  age: number;
  gender: Gender;
  /** Persisted person emoji (gender + skin tone + hair) identifying the member. */
  avatar: string;
  happiness: number;
  characteristics: string[];
  skills: Skills;
  biography: string;
  primarySkill: SkillType;
}
