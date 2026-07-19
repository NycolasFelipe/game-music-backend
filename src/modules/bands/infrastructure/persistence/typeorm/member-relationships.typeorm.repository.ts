import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import {
  canonicalPair,
  generateInitialLevel,
} from "@/modules/bands/domain/generation/relationship.generator";
import { MemberRelationshipsRepository } from "@/modules/bands/domain/repositories/member-relationships.repository";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { MemberRelationshipOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/member-relationship.orm-entity";

/**
 * TypeORM-backed implementation of {@link MemberRelationshipsRepository}.
 */
@Injectable()
export class MemberRelationshipsTypeormRepository implements MemberRelationshipsRepository {
  constructor(
    @InjectRepository(MemberRelationshipOrmEntity)
    private readonly repository: Repository<MemberRelationshipOrmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Lists all relationships of a band.
   *
   * @param bandId - The band id.
   * @returns The band's domain relationships.
   */
  async findByBandId(bandId: string): Promise<MemberRelationshipEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "ASC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Creates any missing pairwise relationships between the member and the other
   * members of the band (idempotent).
   *
   * @param bandId - The band id.
   * @param memberId - The member to sync relationships for.
   * @returns A promise that resolves once syncing completes.
   */
  async syncForMember(bandId: string, memberId: string): Promise<void> {
    const members = await this.dataSource
      .getRepository(BandMemberOrmEntity)
      .find({ where: { bandId }, select: { id: true } });
    const otherIds = members.map((m) => m.id).filter((id) => id !== memberId);

    const existing = await this.repository.find({
      where: [
        { bandId, memberAId: memberId },
        { bandId, memberBId: memberId },
      ],
    });
    const linked = new Set(
      existing
        .flatMap((r) => [r.memberAId, r.memberBId])
        .filter((id) => id !== memberId),
    );

    const toCreate = otherIds
      .filter((id) => !linked.has(id))
      .map((otherId) => {
        const [memberAId, memberBId] = canonicalPair(memberId, otherId);
        return this.repository.create({
          bandId,
          memberAId,
          memberBId,
          level: generateInitialLevel(),
        });
      });

    if (toCreate.length > 0) {
      await this.repository.save(toCreate);
    }
  }

  /**
   * Sets (upserts) the level between two members of a band, validating that
   * both belong to the band.
   *
   * @param bandId - The band id.
   * @param memberId1 - One member id.
   * @param memberId2 - The other member id.
   * @param level - The new level.
   * @returns The updated relationship, or `null` when a member is not in the
   * band (or the two ids are equal).
   */
  async setLevel(
    bandId: string,
    memberId1: string,
    memberId2: string,
    level: number,
  ): Promise<MemberRelationshipEntity | null> {
    if (memberId1 === memberId2) {
      return null;
    }

    const [memberAId, memberBId] = canonicalPair(memberId1, memberId2);

    const membersInBand = await this.dataSource
      .getRepository(BandMemberOrmEntity)
      .count({ where: { bandId, id: In([memberAId, memberBId]) } });
    if (membersInBand < 2) {
      return null;
    }

    const existing = await this.repository.findOne({
      where: { memberAId, memberBId },
    });

    const orm = existing
      ? Object.assign(existing, { level })
      : this.repository.create({ bandId, memberAId, memberBId, level });

    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link MemberRelationshipEntity}.
   */
  private toDomain(orm: MemberRelationshipOrmEntity): MemberRelationshipEntity {
    return new MemberRelationshipEntity(
      orm.id,
      orm.bandId,
      orm.memberAId,
      orm.memberBId,
      orm.level,
      orm.createdAt,
      orm.updatedAt,
    );
  }
}
