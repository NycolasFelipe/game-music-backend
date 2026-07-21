import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type { SalaryChangeReason } from "@/modules/band-members/domain/constants/salary.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import type { SalaryAgreementEntity } from "@/modules/band-members/domain/entities/salary-agreement.entity";

/** DI token for the band-members repository implementation. */
export const BAND_MEMBERS_REPOSITORY = Symbol("BAND_MEMBERS_REPOSITORY");

/** Data required to persist a new band member. */
export interface CreateBandMemberData {
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
  joinYear?: number | null;
}

/** Editable fields of an existing band member. */
export interface UpdateBandMemberData {
  name?: string;
  age?: number;
  biography?: string;
}

/** A salary change to record (updates the current salary and the history). */
export interface SetSalaryData {
  /** New salary amount. */
  amount: number;
  /** In-game year the change takes effect. */
  effectiveYear: number;
  /** Why the salary changed. */
  reason: SalaryChangeReason;
}

/**
 * Persistence contract for band members. All lookups are scoped by band so a
 * member can only be reached through the band that owns it.
 */
export interface BandMembersRepository {
  /**
   * Persists a new member for a band.
   *
   * @param data - The member data, including the target band id.
   * @returns The newly created member.
   */
  create(data: CreateBandMemberData): Promise<BandMemberEntity>;

  /**
   * Lists all members of a band.
   *
   * @param bandId - The band id.
   * @returns The band's members.
   */
  findByBandId(bandId: string): Promise<BandMemberEntity[]>;

  /**
   * Finds a member by id within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns The member, or `null` when not found in that band.
   */
  findByIdAndBandId(
    id: string,
    bandId: string,
  ): Promise<BandMemberEntity | null>;

  /**
   * Counts the members of a band.
   *
   * @param bandId - The band id.
   * @returns The number of members.
   */
  countByBandId(bandId: string): Promise<number>;

  /**
   * Updates editable fields of a member within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @param changes - The editable fields to apply.
   * @returns The updated member, or `null` when not found in that band.
   */
  update(
    id: string,
    bandId: string,
    changes: UpdateBandMemberData,
  ): Promise<BandMemberEntity | null>;

  /**
   * Deletes a member by id within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns `true` when a member was deleted, `false` otherwise.
   */
  deleteByIdAndBandId(id: string, bandId: string): Promise<boolean>;

  /**
   * Sets a member's salary atomically: updates the current `salary` column and
   * appends the change to the salary history (ADR-0010 §1).
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @param data - The new amount, effective year and reason.
   * @returns The updated member, or `null` when not found in that band.
   */
  setSalary(
    id: string,
    bandId: string,
    data: SetSalaryData,
  ): Promise<BandMemberEntity | null>;

  /**
   * Lists a member's salary history (newest first).
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns The member's salary agreements (empty when none).
   */
  findSalaryHistory(
    id: string,
    bandId: string,
  ): Promise<SalaryAgreementEntity[]>;
}
