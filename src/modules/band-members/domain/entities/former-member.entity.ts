import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";

/** A snapshot of one relationship the member had when they left. */
export interface FormerMemberRelationship {
  /** The other member's name at the time of departure. */
  memberName: string;
  /** The relationship level (-5..5). */
  level: number;
}

/** Why a member left the band. */
export type DepartureReason = "salario_atrasado";

/**
 * Domain representation of a former (departed) band member — a frozen snapshot
 * taken at departure (ADR-0010), so ex-members remain viewable after their live
 * `band_members` row is removed.
 */
export class FormerMemberEntity {
  constructor(
    public readonly id: string,
    public readonly bandId: string,
    /** The id the member had while active (for reference; not a live FK). */
    public readonly originalMemberId: string,
    public readonly name: string,
    public readonly age: number,
    public readonly gender: Gender,
    public readonly avatar: string,
    /** Happiness at departure. */
    public readonly happiness: number,
    public readonly characteristics: string[],
    public readonly skills: Skills,
    public readonly biography: string,
    public readonly primarySkill: SkillType,
    public readonly joinYear: number | null,
    /** Last salary before leaving. */
    public readonly salary: number,
    /** Consecutive turns unpaid at departure. */
    public readonly unpaidTurns: number,
    public readonly reason: DepartureReason,
    /** In-game year the member left. */
    public readonly leftAtYear: number,
    /** Snapshot of the member's relationships at departure. */
    public readonly relationships: FormerMemberRelationship[],
    public readonly createdAt: Date,
  ) {}
}
