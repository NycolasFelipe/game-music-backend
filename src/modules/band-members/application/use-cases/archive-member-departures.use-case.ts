import { Inject, Injectable } from "@nestjs/common";
import { MemberDepartureArchiveInput } from "@/modules/band-members/application/dto/member-departure-archive.input";
import { FormerMemberView } from "@/modules/band-members/application/dto/former-member.view";
import { toFormerMemberView } from "@/modules/band-members/application/mappers/former-member.mapper";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";
import { FORMER_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/former-members.repository";
import type {
  CreateFormerMemberData,
  FormerMembersRepository,
} from "@/modules/band-members/domain/repositories/former-members.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import type { MemberRelationshipsRepository } from "@/modules/bands/domain/repositories/member-relationships.repository";

/**
 * Archives departing members as {@link FormerMemberEntity} snapshots before they
 * are removed from the band (ADR-0010). Runs in the turn tick **before** the
 * deletion, capturing the member's data, mood, last salary, turns unpaid and a
 * snapshot of their relationships (with the other members' names).
 */
@Injectable()
export class ArchiveMemberDeparturesUseCase {
  constructor(
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
    @Inject(MEMBER_RELATIONSHIPS_REPOSITORY)
    private readonly relationshipsRepository: MemberRelationshipsRepository,
    @Inject(FORMER_MEMBERS_REPOSITORY)
    private readonly formerMembersRepository: FormerMembersRepository,
  ) {}

  /**
   * Snapshots and persists the departing members. Members not found (already
   * gone) are skipped.
   *
   * @param bandId - The band the members are leaving.
   * @param year - The in-game year of departure.
   * @param departures - The members leaving (id + turns unpaid + reason).
   * @returns The archived former members as public views (same order, minus any
   * skipped).
   */
  async execute(
    bandId: string,
    year: number,
    departures: MemberDepartureArchiveInput[],
  ): Promise<FormerMemberView[]> {
    if (departures.length === 0) {
      return [];
    }

    const members = await this.bandMembersRepository.findByBandId(bandId);
    const relationships =
      await this.relationshipsRepository.findByBandId(bandId);
    const nameById = new Map(members.map((member) => [member.id, member.name]));

    const records: CreateFormerMemberData[] = [];
    for (const departure of departures) {
      const member = members.find((m) => m.id === departure.memberId);
      if (!member) {
        continue;
      }

      const memberRelationships = relationships
        .filter(
          (rel) => rel.memberAId === member.id || rel.memberBId === member.id,
        )
        .map((rel) => {
          const otherId =
            rel.memberAId === member.id ? rel.memberBId : rel.memberAId;
          return { memberName: nameById.get(otherId) ?? "?", level: rel.level };
        });

      records.push({
        bandId,
        originalMemberId: member.id,
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
        unpaidTurns: departure.unpaidTurns,
        reason: departure.reason,
        leftAtYear: year,
        relationships: memberRelationships,
      });
    }

    const created = await this.formerMembersRepository.createMany(records);
    return created.map(toFormerMemberView);
  }
}
