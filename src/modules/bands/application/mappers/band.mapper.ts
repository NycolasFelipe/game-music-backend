import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { BandView } from "@/modules/bands/application/dto/band.view";
import { FameView } from "@/modules/bands/application/dto/fame.view";
import { BandWithMembersView } from "@/modules/bands/application/dto/band-with-members.view";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import type { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { targetSalary } from "@/modules/band-members/domain/salary/salary.calculator";
import type { BandWithMembers } from "@/modules/bands/domain/entities/band-with-members";
import type { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import type { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { describeFame } from "@/modules/bands/domain/fame/fame.calculator";

/**
 * Derives a band's fame view from its fan count.
 *
 * @param fanCount - The band's fan count.
 * @returns The fame view.
 */
export function toFameView(fanCount: number): FameView {
  return describeFame(fanCount);
}

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
    fame: toFameView(band.fanCount),
    currentYear: band.currentYear,
    balance: band.balance,
    createdAt: band.createdAt,
    updatedAt: band.updatedAt,
  };
}

/**
 * Maps a band-member domain entity to its public view. The band's fan count is
 * needed to derive the salary target (ADR-0010 §8).
 *
 * @param member - The band-member domain entity.
 * @param fanCount - The band's current fan count (drives the salary target).
 * @returns The member view.
 */
export function toBandMemberView(
  member: BandMemberEntity,
  fanCount: number,
): BandMemberView {
  return {
    id: member.id,
    bandId: member.bandId,
    name: member.name,
    age: member.age,
    gender: member.gender,
    avatar: member.avatar,
    happiness: member.happiness,
    characteristics: member.characteristics,
    skills: member.skills,
    biography: member.biography,
    primarySkill: member.primarySkill,
    joinYear: member.joinYear,
    salary: member.salary,
    salaryTarget: targetSalary(member.skills, member.characteristics, fanCount),
    salaryUnpaidTurns: member.salaryUnpaidTurns,
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
    members: composed.members.map((member) =>
      toBandMemberView(member, composed.band.fanCount),
    ),
    relationships: composed.relationships.map(toMemberRelationshipView),
  };
}
