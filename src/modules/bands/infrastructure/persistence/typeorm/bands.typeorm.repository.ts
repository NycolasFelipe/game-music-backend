import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { toBandMemberDomain } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.mapper";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { BandWithMembers } from "@/modules/bands/domain/entities/band-with-members";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import {
  BandsRepository,
  CreateBandData,
  CreateBandMemberSeed,
} from "@/modules/bands/domain/repositories/bands.repository";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";

/**
 * TypeORM-backed implementation of {@link BandsRepository}. As the aggregate
 * root repository it also writes/reads `band_members` (via the DataSource) for
 * composed band-with-members operations.
 */
@Injectable()
export class BandsTypeormRepository implements BandsRepository {
  constructor(
    @InjectRepository(BandOrmEntity)
    private readonly repository: Repository<BandOrmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Persists a new band together with its members, atomically.
   *
   * @param data - The band scalar data, including the owner id.
   * @param members - The members to create for the band.
   * @returns The created band composed with its persisted members.
   */
  async createWithMembers(
    data: CreateBandData,
    members: CreateBandMemberSeed[],
  ): Promise<BandWithMembers> {
    return this.dataSource.transaction(async (manager) => {
      const bandRepo = manager.getRepository(BandOrmEntity);
      const memberRepo = manager.getRepository(BandMemberOrmEntity);

      const savedBand = await bandRepo.save(
        bandRepo.create({
          ownerId: data.ownerId,
          name: data.name,
          theme: data.theme,
          origin: data.origin,
          foundationYear: data.foundationYear,
          fanCount: data.fanCount ?? 0,
        }),
      );

      const memberOrms = members.map((member) =>
        memberRepo.create({
          bandId: savedBand.id,
          name: member.name,
          age: member.age,
          gender: member.gender,
          happiness: member.happiness,
          characteristics: member.characteristics,
          skills: member.skills,
          biography: member.biography,
          primarySkill: member.primarySkill,
          joinYear: member.joinYear ?? null,
        }),
      );
      const savedMembers = memberOrms.length
        ? await memberRepo.save(memberOrms)
        : [];

      return {
        band: this.toDomain(savedBand),
        members: savedMembers.map(toBandMemberDomain),
      };
    });
  }

  /**
   * Finds a band by id, scoped to its owner (scalars only).
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns The domain band, or `null` when not found for this owner.
   */
  async findByIdAndOwner(
    id: string,
    ownerId: string,
  ): Promise<BandEntity | null> {
    const orm = await this.repository.findOne({ where: { id, ownerId } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Finds a band by id (scoped to its owner) composed with its members.
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns The band with members, or `null` when not found for this owner.
   */
  async findByIdAndOwnerWithMembers(
    id: string,
    ownerId: string,
  ): Promise<BandWithMembers | null> {
    const orm = await this.repository.findOne({ where: { id, ownerId } });
    if (!orm) {
      return null;
    }

    const memberOrms = await this.dataSource
      .getRepository(BandMemberOrmEntity)
      .find({ where: { bandId: id }, order: { createdAt: "ASC" } });

    return {
      band: this.toDomain(orm),
      members: memberOrms.map(toBandMemberDomain),
    };
  }

  /**
   * Lists all bands belonging to an owner (newest first).
   *
   * @param ownerId - The owning user's id.
   * @returns The owner's domain bands.
   */
  async findAllByOwner(ownerId: string): Promise<BandEntity[]> {
    const orms = await this.repository.find({
      where: { ownerId },
      order: { createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Deletes a band by id, scoped to its owner (cascades to its members).
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns `true` when a band was deleted, `false` otherwise.
   */
  async deleteByIdAndOwner(id: string, ownerId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, ownerId });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link BandEntity}.
   */
  private toDomain(orm: BandOrmEntity): BandEntity {
    return new BandEntity(
      orm.id,
      orm.ownerId,
      orm.name,
      orm.theme,
      orm.origin,
      orm.foundationYear,
      orm.fanCount,
      orm.createdAt,
      orm.updatedAt,
    );
  }
}
