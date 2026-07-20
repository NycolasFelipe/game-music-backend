import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { CreationEventEntity } from "@/modules/releases/domain/entities/creation-event.entity";
import { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";
import {
  CreateReleaseData,
  FinalizeReleaseData,
  ReleasesRepository,
  ResolveCreationEventData,
  RoyaltyPayoutData,
} from "@/modules/releases/domain/repositories/releases.repository";
import type { GeneratedCreationEvent } from "@/modules/releases/domain/types/creation-event";
import { ReleaseCreationEventOrmEntity } from "@/modules/releases/infrastructure/persistence/typeorm/release-creation-event.orm-entity";
import { ReleaseOrmEntity } from "@/modules/releases/infrastructure/persistence/typeorm/release.orm-entity";

/**
 * TypeORM-backed implementation of {@link ReleasesRepository}.
 */
@Injectable()
export class ReleasesTypeormRepository implements ReleasesRepository {
  constructor(
    @InjectRepository(ReleaseOrmEntity)
    private readonly repository: Repository<ReleaseOrmEntity>,
    @InjectRepository(ReleaseCreationEventOrmEntity)
    private readonly creationEventRepository: Repository<ReleaseCreationEventOrmEntity>,
  ) {}

  /**
   * Persists a new release draft (`em_criacao`).
   *
   * @param data - The draft's authorship data.
   * @returns The created release.
   */
  async create(data: CreateReleaseData): Promise<ReleaseEntity> {
    const saved = await this.repository.save(
      this.repository.create({
        bandId: data.bandId,
        title: data.title,
        concept: data.concept,
        format: data.format,
        style: data.style,
        budgetTier: data.budgetTier,
        status: "em_criacao",
        credits: data.credits,
        royaltyRemaining: 0,
        royaltyTurnsLeft: 0,
        creationLog: [],
      }),
    );
    return this.toDomain(saved);
  }

  /**
   * Finds a release by id, scoped to its band.
   *
   * @param id - The release id.
   * @param bandId - The owning band id.
   * @returns The domain release, or `null` when not found for this band.
   */
  async findByIdAndBand(
    id: string,
    bandId: string,
  ): Promise<ReleaseEntity | null> {
    const orm = await this.repository.findOne({ where: { id, bandId } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Lists a band's releases (discography), newest first.
   *
   * @param bandId - The band id.
   * @returns The band's domain releases.
   */
  async findByBandId(bandId: string): Promise<ReleaseEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "DESC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Applies the outcome of finalization and flips the status to `lancada`.
   *
   * @param id - The release id.
   * @param data - The computed outcome fields.
   * @returns The finalized release.
   */
  async finalize(
    id: string,
    data: FinalizeReleaseData,
  ): Promise<ReleaseEntity> {
    await this.repository.update(
      { id },
      {
        status: "lancada",
        quality: data.quality,
        qualityTier: data.qualityTier,
        fansGained: data.fansGained,
        cost: data.cost,
        masterRevenueTotal: data.masterRevenueTotal,
        publishingRevenueTotal: data.publishingRevenueTotal,
        royaltyRemaining: data.royaltyRemaining,
        royaltyTurnsLeft: data.royaltyTurnsLeft,
        releasedAtYear: data.releasedAtYear,
        creationLog: data.creationLog,
        details: data.details,
      },
    );
    const orm = await this.repository.findOneOrFail({ where: { id } });
    return this.toDomain(orm);
  }

  /**
   * Deletes a release by id, scoped to its band.
   *
   * @param id - The release id.
   * @param bandId - The owning band id.
   * @returns `true` when a release was deleted, `false` otherwise.
   */
  async deleteByIdAndBand(id: string, bandId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, bandId });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Counts a band's releases still in creation (drafts).
   *
   * @param bandId - The band id.
   * @returns The number of in-creation releases.
   */
  async countInCreation(bandId: string): Promise<number> {
    return this.repository.count({ where: { bandId, status: "em_criacao" } });
  }

  /**
   * Lists a band's launched releases that still have a royalty tail to pay.
   *
   * @param bandId - The band id.
   * @returns The releases with a remaining royalty tail.
   */
  async findActiveRoyaltyReleases(bandId: string): Promise<ReleaseEntity[]> {
    const orms = await this.repository.find({
      where: {
        bandId,
        status: "lancada",
        royaltyTurnsLeft: MoreThan(0),
        royaltyRemaining: MoreThan(0),
      },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Applies a turn's royalty payout to a release (new absolute tail values).
   *
   * @param id - The release id.
   * @param data - The new remaining tail and turns-left.
   * @returns A promise that resolves once applied.
   */
  async applyRoyaltyPayout(id: string, data: RoyaltyPayoutData): Promise<void> {
    await this.repository.update(
      { id },
      {
        royaltyRemaining: data.royaltyRemaining,
        royaltyTurnsLeft: data.royaltyTurnsLeft,
      },
    );
  }

  /**
   * Persists the generated creation events for a release draft.
   *
   * @param releaseId - The release the events belong to.
   * @param events - The generated events to persist.
   * @returns The persisted creation events.
   */
  async createCreationEvents(
    releaseId: string,
    events: GeneratedCreationEvent[],
  ): Promise<CreationEventEntity[]> {
    if (events.length === 0) {
      return [];
    }
    const orms = events.map((event) =>
      this.creationEventRepository.create({
        releaseId,
        sequence: event.sequence,
        kind: event.kind,
        prompt: event.prompt,
        options: event.options,
        resolved: false,
      }),
    );
    const saved = await this.creationEventRepository.save(orms);
    return saved.map((orm) => this.creationEventToDomain(orm));
  }

  /**
   * Lists a release's creation events, ordered by sequence.
   *
   * @param releaseId - The release id.
   * @returns The creation events.
   */
  async findCreationEventsByRelease(
    releaseId: string,
  ): Promise<CreationEventEntity[]> {
    const orms = await this.creationEventRepository.find({
      where: { releaseId },
      order: { sequence: "ASC" },
    });
    return orms.map((orm) => this.creationEventToDomain(orm));
  }

  /**
   * Finds a single creation event scoped to its release.
   *
   * @param id - The creation-event id.
   * @param releaseId - The owning release id.
   * @returns The creation event, or `null` when not found.
   */
  async findCreationEvent(
    id: string,
    releaseId: string,
  ): Promise<CreationEventEntity | null> {
    const orm = await this.creationEventRepository.findOne({
      where: { id, releaseId },
    });
    return orm ? this.creationEventToDomain(orm) : null;
  }

  /**
   * Records the resolution of a creation event.
   *
   * @param id - The creation-event id.
   * @param data - The chosen option and the quality modifier it produced.
   * @returns The resolved creation event.
   */
  async resolveCreationEvent(
    id: string,
    data: ResolveCreationEventData,
  ): Promise<CreationEventEntity> {
    await this.creationEventRepository.update(
      { id },
      {
        resolved: true,
        chosenOptionId: data.chosenOptionId,
        qualityModifier: data.qualityModifier,
      },
    );
    const orm = await this.creationEventRepository.findOneOrFail({
      where: { id },
    });
    return this.creationEventToDomain(orm);
  }

  /**
   * Counts a release's unresolved creation events.
   *
   * @param releaseId - The release id.
   * @returns The number of pending creation events.
   */
  async countPendingCreationEvents(releaseId: string): Promise<number> {
    return this.creationEventRepository.count({
      where: { releaseId, resolved: false },
    });
  }

  /**
   * Maps a raw creation-event ORM record to its domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link CreationEventEntity}.
   */
  private creationEventToDomain(
    orm: ReleaseCreationEventOrmEntity,
  ): CreationEventEntity {
    return new CreationEventEntity(
      orm.id,
      orm.releaseId,
      orm.sequence,
      orm.kind,
      orm.prompt,
      orm.options,
      orm.resolved,
      orm.chosenOptionId,
      orm.qualityModifier,
      orm.createdAt,
    );
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link ReleaseEntity}.
   */
  private toDomain(orm: ReleaseOrmEntity): ReleaseEntity {
    return new ReleaseEntity(
      orm.id,
      orm.bandId,
      orm.title,
      orm.concept,
      orm.format,
      orm.style,
      orm.budgetTier,
      orm.status,
      orm.credits,
      orm.quality,
      orm.qualityTier,
      orm.fansGained,
      orm.cost,
      orm.masterRevenueTotal,
      orm.publishingRevenueTotal,
      orm.royaltyRemaining,
      orm.royaltyTurnsLeft,
      orm.releasedAtYear,
      orm.creationLog,
      orm.details,
      orm.createdAt,
    );
  }
}
