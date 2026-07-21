import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * Domain representation of a band member (the game's "character").
 * Belongs to a single band via {@link bandId}.
 */
export class BandMemberEntity {
  constructor(
    public readonly id: string,
    /** Id of the band this member belongs to. */
    public readonly bandId: string,
    public readonly name: string,
    /** Age in years (16..30). */
    public readonly age: number,
    public readonly gender: Gender,
    /** Persisted person emoji (gender + skin tone + hair) identifying the member. */
    public readonly avatar: string,
    /** Individual happiness, -5..5 (up to 2 decimals). */
    public readonly happiness: number,
    /** IDs of characteristics/traits (2..4), referencing the static catalog. */
    public readonly characteristics: string[],
    public readonly skills: Skills,
    public readonly biography: string,
    /** Highest skill, used to guide the biography. */
    public readonly primarySkill: SkillType,
    /** Year the member joined the band (null when unset). */
    public readonly joinYear: number | null,
    /** Current salary paid per turn (ADR-0010). */
    public readonly salary: number,
    /** Consecutive turns the member went unpaid (arrears counter, ADR-0010). */
    public readonly salaryUnpaidTurns: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
