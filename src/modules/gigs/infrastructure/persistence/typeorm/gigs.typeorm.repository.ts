import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GigEntity } from "@/modules/gigs/domain/entities/gig.entity";
import type {
  CreateGigData,
  GigsRepository,
} from "@/modules/gigs/domain/repositories/gigs.repository";
import { GigOrmEntity } from "@/modules/gigs/infrastructure/persistence/typeorm/gig.orm-entity";

/** TypeORM-backed implementation of {@link GigsRepository}. */
@Injectable()
export class GigsTypeormRepository implements GigsRepository {
  constructor(
    @InjectRepository(GigOrmEntity)
    private readonly repository: Repository<GigOrmEntity>,
  ) {}

  /**
   * Records a played season.
   *
   * @param data - The season's outcome.
   * @returns The persisted domain gig.
   */
  async create(data: CreateGigData): Promise<GigEntity> {
    const saved = await this.repository.save(this.repository.create(data));
    return this.toDomain(saved);
  }

  /**
   * Lists a band's played seasons, newest first.
   *
   * @param bandId - The band id.
   * @returns The band's domain gig history.
   */
  async findByBandId(bandId: string): Promise<GigEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { playedAtYear: "DESC", createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Counts the seasons a band played in a given live year (the turn's slot).
   *
   * @param bandId - The band id.
   * @param year - The band's live year.
   * @returns The number of seasons already played that turn.
   */
  async countByBandAndYear(bandId: string, year: number): Promise<number> {
    return this.repository.count({ where: { bandId, playedAtYear: year } });
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link GigEntity}.
   */
  private toDomain(orm: GigOrmEntity): GigEntity {
    return new GigEntity(
      orm.id,
      orm.bandId,
      orm.gigTypeId,
      orm.playedAtYear,
      orm.fee,
      orm.cost,
      orm.fansGained,
      orm.performance,
      orm.happinessDelta,
      orm.createdAt,
    );
  }
}
