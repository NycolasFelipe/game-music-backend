import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FormerMemberEntity } from "@/modules/band-members/domain/entities/former-member.entity";
import {
  CreateFormerMemberData,
  FormerMembersRepository,
} from "@/modules/band-members/domain/repositories/former-members.repository";
import { FormerMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/former-member.orm-entity";

/**
 * TypeORM-backed implementation of {@link FormerMembersRepository}.
 */
@Injectable()
export class FormerMembersTypeormRepository implements FormerMembersRepository {
  constructor(
    @InjectRepository(FormerMemberOrmEntity)
    private readonly repository: Repository<FormerMemberOrmEntity>,
  ) {}

  /**
   * Archives many departed members at once.
   *
   * @param data - The former-member snapshots to persist.
   * @returns The created domain former members.
   */
  async createMany(
    data: CreateFormerMemberData[],
  ): Promise<FormerMemberEntity[]> {
    if (data.length === 0) {
      return [];
    }
    const orms = this.repository.create(data);
    const saved = await this.repository.save(orms);
    return saved.map((orm) => this.toDomain(orm));
  }

  /**
   * Lists a band's former members (most recent departures first).
   *
   * @param bandId - The band id.
   * @returns The band's domain former members.
   */
  async findByBandId(bandId: string): Promise<FormerMemberEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link FormerMemberEntity}.
   */
  private toDomain(orm: FormerMemberOrmEntity): FormerMemberEntity {
    return new FormerMemberEntity(
      orm.id,
      orm.bandId,
      orm.originalMemberId,
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
      orm.salary,
      orm.unpaidTurns,
      orm.reason,
      orm.leftAtYear,
      orm.relationships,
      orm.createdAt,
    );
  }
}
