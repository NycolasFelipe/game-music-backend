import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import {
  BandsRepository,
  CreateBandData,
} from "@/modules/bands/domain/repositories/bands.repository";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";

/**
 * TypeORM-backed implementation of {@link BandsRepository}.
 */
@Injectable()
export class BandsTypeormRepository implements BandsRepository {
  constructor(
    @InjectRepository(BandOrmEntity)
    private readonly repository: Repository<BandOrmEntity>,
  ) {}

  /**
   * Persists a new band.
   *
   * @param data - The band scalar data, including the owner id.
   * @returns The newly created domain band.
   */
  async create(data: CreateBandData): Promise<BandEntity> {
    const orm = this.repository.create({
      ownerId: data.ownerId,
      name: data.name,
      theme: data.theme,
      origin: data.origin,
      foundationYear: data.foundationYear,
      fanCount: data.fanCount ?? 0,
    });
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Finds a band by id, scoped to its owner.
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
   * Deletes a band by id, scoped to its owner.
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
