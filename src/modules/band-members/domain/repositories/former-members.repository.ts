import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type {
  DepartureReason,
  FormerMemberEntity,
  FormerMemberRelationship,
} from "@/modules/band-members/domain/entities/former-member.entity";

/** DI token for the former-members repository implementation. */
export const FORMER_MEMBERS_REPOSITORY = Symbol("FORMER_MEMBERS_REPOSITORY");

/** Data required to archive a departed member. */
export interface CreateFormerMemberData {
  bandId: string;
  originalMemberId: string;
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
  salary: number;
  unpaidTurns: number;
  reason: DepartureReason;
  leftAtYear: number;
  relationships: FormerMemberRelationship[];
}

/**
 * Persistence contract for former (departed) members. Scoped by band.
 */
export interface FormerMembersRepository {
  /**
   * Archives many departed members at once.
   *
   * @param data - The former-member snapshots to persist.
   * @returns The created former members.
   */
  createMany(data: CreateFormerMemberData[]): Promise<FormerMemberEntity[]>;

  /**
   * Lists a band's former members (most recent departures first).
   *
   * @param bandId - The band id.
   * @returns The band's former members.
   */
  findByBandId(bandId: string): Promise<FormerMemberEntity[]>;
}
