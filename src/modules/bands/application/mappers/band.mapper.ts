import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { BandView } from "@/modules/bands/application/dto/band.view";
import { BandWithMembersView } from "@/modules/bands/application/dto/band-with-members.view";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import type { BandWithMembers } from "@/modules/bands/domain/entities/band-with-members";
import type { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import type { BandEntity } from "@/modules/bands/domain/entities/band.entity";

/**
 * Maps a band domain entity to its public view.
 *
 * @param band - The band domain entity.
 * @returns The band view.
 */
export function toBandView(band: BandEntity): BandView {
  return {
    id: band.id,
    name: band.name,
    theme: band.theme,
    origin: band.origin,
    foundationYear: band.foundationYear,
    fanCount: band.fanCount,
    createdAt: band.createdAt,
    updatedAt: band.updatedAt,
  };
}

/**
 * Maps a band-member domain entity to its public view.
 *
 * @param member - The band-member domain entity.
 * @returns The member view.
 */
export function toBandMemberView(member: BandMemberEntity): BandMemberView {
  return {
    id: member.id,
    bandId: member.bandId,
    name: member.name,
    age: member.age,
    gender: member.gender,
    happiness: member.happiness,
    characteristics: member.characteristics,
    skills: member.skills,
    biography: member.biography,
    primarySkill: member.primarySkill,
    joinYear: member.joinYear,
  };
}

/**
 * Maps a member-relationship domain entity to its public view.
 *
 * @param relationship - The relationship domain entity.
 * @returns The relationship view.
 */
export function toMemberRelationshipView(
  relationship: MemberRelationshipEntity,
): MemberRelationshipView {
  return {
    memberAId: relationship.memberAId,
    memberBId: relationship.memberBId,
    level: relationship.level,
  };
}

/**
 * Maps a composed band-with-members read model to its public view.
 *
 * @param composed - The band with its members and relationships.
 * @returns The band-with-members view.
 */
export function toBandWithMembersView(
  composed: BandWithMembers,
): BandWithMembersView {
  return {
    ...toBandView(composed.band),
    members: composed.members.map(toBandMemberView),
    relationships: composed.relationships.map(toMemberRelationshipView),
  };
}
