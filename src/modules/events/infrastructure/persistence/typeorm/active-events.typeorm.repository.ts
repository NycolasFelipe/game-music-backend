import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { ActiveEventEntity } from "@/modules/events/domain/entities/active-event.entity";
import {
  ActiveEventsRepository,
  CreateActiveEventData,
} from "@/modules/events/domain/repositories/active-events.repository";
import type { EventConsequence } from "@/modules/events/domain/types/event-consequence";
import { ActiveEventOrmEntity } from "@/modules/events/infrastructure/persistence/typeorm/active-event.orm-entity";

/**
 * TypeORM-backed implementation of {@link ActiveEventsRepository}.
 */
@Injectable()
export class ActiveEventsTypeormRepository implements ActiveEventsRepository {
  constructor(
    @InjectRepository(ActiveEventOrmEntity)
    private readonly repository: Repository<ActiveEventOrmEntity>,
  ) {}

  /**
   * Persists a newly generated (pending) active event.
   *
   * @param data - The generated event data.
   * @returns The created domain event.
   */
  async create(data: CreateActiveEventData): Promise<ActiveEventEntity> {
    const orm = this.repository.create({
      bandId: data.bandId,
      templateId: data.templateId,
      year: data.year,
      type: data.type,
      title: data.title,
      description: data.description,
      involvedCharacterIds: data.involvedCharacterIds,
      options: data.options,
      resolved: false,
      chosenOptionId: null,
      outcome: null,
      resolvedAt: null,
    });
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Lists a band's events (newest first).
   *
   * @param bandId - The band id.
   * @returns The band's domain events.
   */
  async findByBandId(bandId: string): Promise<ActiveEventEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Finds an event by id within a band.
   *
   * @param id - The event id.
   * @param bandId - The band id.
   * @returns The domain event, or `null` when not found in that band.
   */
  async findByIdAndBandId(
    id: string,
    bandId: string,
  ): Promise<ActiveEventEntity | null> {
    const orm = await this.repository.findOne({ where: { id, bandId } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Counts a band's still-unresolved (pending) active events.
   *
   * @param bandId - The band id.
   * @returns The number of unresolved events for the band.
   */
  async countUnresolved(bandId: string): Promise<number> {
    return this.repository.count({ where: { bandId, resolved: false } });
  }

  /**
   * Returns the template ids used by a band's events within a year window.
   *
   * @param bandId - The band id.
   * @param year - The reference year.
   * @param window - Half-width of the window, in years.
   * @returns The recently used template ids (deduplicated).
   */
  async recentTemplateIds(
    bandId: string,
    year: number,
    window: number,
  ): Promise<string[]> {
    const orms = await this.repository.find({
      where: { bandId, year: Between(year - window, year + window) },
      select: { templateId: true },
    });
    return [...new Set(orms.map((o) => o.templateId))];
  }

  /**
   * Marks an event resolved with the chosen option and applied outcome.
   *
   * @param id - The event id.
   * @param bandId - The band id.
   * @param chosenOptionId - The id of the chosen option.
   * @param outcome - The applied consequence.
   * @returns The updated domain event, or `null` when not found in that band.
   */
  async markResolved(
    id: string,
    bandId: string,
    chosenOptionId: string,
    outcome: EventConsequence,
  ): Promise<ActiveEventEntity | null> {
    const orm = await this.repository.findOne({ where: { id, bandId } });
    if (!orm) {
      return null;
    }

    orm.resolved = true;
    orm.chosenOptionId = chosenOptionId;
    orm.outcome = outcome;
    orm.resolvedAt = new Date();
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link ActiveEventEntity}.
   */
  private toDomain(orm: ActiveEventOrmEntity): ActiveEventEntity {
    return new ActiveEventEntity(
      orm.id,
      orm.bandId,
      orm.templateId,
      orm.year,
      orm.type,
      orm.title,
      orm.description,
      orm.involvedCharacterIds,
      orm.options,
      orm.resolved,
      orm.chosenOptionId,
      orm.outcome,
      orm.createdAt,
      orm.resolvedAt,
    );
  }
}
