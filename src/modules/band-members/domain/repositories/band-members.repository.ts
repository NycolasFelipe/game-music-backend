import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";

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
}
