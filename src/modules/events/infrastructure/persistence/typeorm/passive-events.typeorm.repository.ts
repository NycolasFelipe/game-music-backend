import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { PassiveEventEntity } from "@/modules/events/domain/entities/passive-event.entity";
import type { RecentPassiveEvent } from "@/modules/events/domain/generation/generated-passive-event";
import {
  CreatePassiveEventData,
  PassiveEventsRepository,
} from "@/modules/events/domain/repositories/passive-events.repository";
import { PassiveEventOrmEntity } from "@/modules/events/infrastructure/persistence/typeorm/passive-event.orm-entity";

/**
 * TypeORM-backed implementation of {@link PassiveEventsRepository}.
 */
@Injectable()
export class PassiveEventsTypeormRepository implements PassiveEventsRepository {
  constructor(
    @InjectRepository(PassiveEventOrmEntity)
    private readonly repository: Repository<PassiveEventOrmEntity>,
  ) {}

  /**
   * Persists many generated passive events at once.
   *
   * @param data - The passive events to create.
   * @returns The created domain events.
   */
  async createMany(
    data: CreatePassiveEventData[],
  ): Promise<PassiveEventEntity[]> {
    if (data.length === 0) {
      return [];
    }
    const orms = this.repository.create(data);
    const saved = await this.repository.save(orms);
    return saved.map((orm) => this.toDomain(orm));
  }

  /**
   * Lists a band's passive events (newest first).
   *
   * @param bandId - The band id.
   * @returns The band's domain passive events.
   */
  async findByBandId(bandId: string): Promise<PassiveEventEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Returns recent events (template id + artists) used by a band within a year
   * window.
   *
   * @param bandId - The band id.
   * @param year - The reference year.
   * @param window - Half-width of the window, in years.
   * @returns The recent events.
   */
  async recentEvents(
    bandId: string,
    year: number,
    window: number,
  ): Promise<RecentPassiveEvent[]> {
    const orms = await this.repository.find({
      where: { bandId, year: Between(year - window, year + window) },
      select: { templateId: true, artists: true },
    });
    return orms.map((orm) => ({
      templateId: orm.templateId,
      artists: orm.artists,
    }));
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link PassiveEventEntity}.
   */
  private toDomain(orm: PassiveEventOrmEntity): PassiveEventEntity {
    return new PassiveEventEntity(
      orm.id,
      orm.bandId,
      orm.templateId,
      orm.year,
      orm.type,
      orm.description,
      orm.artists,
      orm.createdAt,
    );
  }
}
