import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type {
  DepartureReason,
  FormerMemberRelationship,
} from "@/modules/band-members/domain/entities/former-member.entity";

/**
 * Public view of a former (departed) band member — the snapshot shown in the
 * departure modal and the ex-members tab (ADR-0010).
 */
export class FormerMemberView {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  /** Happiness at departure. */
  happiness: number;
  characteristics: string[];
  skills: Skills;
  biography: string;
  primarySkill: SkillType;
  joinYear: number | null;
  /** Last salary before leaving. */
  salary: number;
  /** Consecutive turns unpaid at departure. */
  unpaidTurns: number;
  reason: DepartureReason;
  /** In-game year the member left. */
  leftAtYear: number;
  /** The member's relationships at departure. */
  relationships: FormerMemberRelationship[];
}
