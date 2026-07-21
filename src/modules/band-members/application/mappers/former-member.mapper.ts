import { FormerMemberView } from "@/modules/band-members/application/dto/former-member.view";
import type { FormerMemberEntity } from "@/modules/band-members/domain/entities/former-member.entity";

/**
 * Maps a former-member domain entity to its public view.
 *
 * @param former - The former-member domain entity.
 * @returns The former-member view.
 */
export function toFormerMemberView(
  former: FormerMemberEntity,
): FormerMemberView {
  return {
    id: former.id,
    name: former.name,
    age: former.age,
    gender: former.gender,
    avatar: former.avatar,
    happiness: former.happiness,
    characteristics: former.characteristics,
    skills: former.skills,
    biography: former.biography,
    primarySkill: former.primarySkill,
    joinYear: former.joinYear,
    salary: former.salary,
    unpaidTurns: former.unpaidTurns,
    reason: former.reason,
    leftAtYear: former.leftAtYear,
    relationships: former.relationships,
  };
}
