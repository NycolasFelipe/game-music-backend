import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BandActivityEntity } from "@/modules/activities/domain/entities/band-activity.entity";
import type {
  BandActivitiesRepository,
  CreateBandActivityData,
} from "@/modules/activities/domain/repositories/band-activities.repository";
import { BandActivityOrmEntity } from "@/modules/activities/infrastructure/persistence/typeorm/band-activity.orm-entity";

/** TypeORM-backed implementation of {@link BandActivitiesRepository}. */
@Injectable()
export class BandActivitiesTypeormRepository implements BandActivitiesRepository {
  constructor(
    @InjectRepository(BandActivityOrmEntity)
    private readonly repository: Repository<BandActivityOrmEntity>,
  ) {}

  /**
   * Records a held activity.
   *
   * @param data - The activity's outcome.
   * @returns The persisted domain activity.
   */
  async create(data: CreateBandActivityData): Promise<BandActivityEntity> {
    const saved = await this.repository.save(this.repository.create(data));
    return this.toDomain(saved);
  }

  /**
   * Lists a band's activities, newest first.
   *
   * @param bandId - The band id.
   * @returns The band's domain activity history.
   */
  async findByBandId(bandId: string): Promise<BandActivityEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { heldAtYear: "DESC", createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Counts the activities a band held in a given live year.
   *
   * @param bandId - The band id.
   * @param year - The band's live year.
   * @returns The number of activities already held that turn.
   */
  async countByBandAndYear(bandId: string, year: number): Promise<number> {
    return this.repository.count({ where: { bandId, heldAtYear: year } });
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link BandActivityEntity}.
   */
  private toDomain(orm: BandActivityOrmEntity): BandActivityEntity {
    return new BandActivityEntity(
      orm.id,
      orm.bandId,
      orm.activityId,
      orm.heldAtYear,
      orm.cost,
      orm.participantIds ?? [],
      orm.happinessDelta,
      orm.relationshipDelta,
      orm.trouble,
      orm.troubleEventId,
      orm.createdAt,
    );
  }
}
