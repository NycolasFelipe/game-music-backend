import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";

/**
 * Maps a raw band-member ORM record to a clean domain entity. Exported as a
 * pure function so both the band-members repository and the bands aggregate
 * repository can reuse it without duplicating the mapping.
 *
 * @param orm - The persistence model loaded from the database.
 * @returns The corresponding {@link BandMemberEntity}.
 */
export function toBandMemberDomain(orm: BandMemberOrmEntity): BandMemberEntity {
  return new BandMemberEntity(
    orm.id,
    orm.bandId,
    orm.name,
    orm.age,
    orm.gender,
    orm.avatar,
    orm.happiness,
    orm.characteristics,
    orm.skills,
    orm.biography,
    orm.primarySkill,
    orm.joinYear,
    orm.createdAt,
    orm.updatedAt,
  );
}
