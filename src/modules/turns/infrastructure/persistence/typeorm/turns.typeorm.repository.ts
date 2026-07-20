import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";
import {
  CreateTurnData,
  TurnsRepository,
} from "@/modules/turns/domain/repositories/turns.repository";
import { TurnOrmEntity } from "@/modules/turns/infrastructure/persistence/typeorm/turn.orm-entity";

/**
 * TypeORM-backed implementation of {@link TurnsRepository}.
 */
@Injectable()
export class TurnsTypeormRepository implements TurnsRepository {
  constructor(
    @InjectRepository(TurnOrmEntity)
    private readonly repository: Repository<TurnOrmEntity>,
  ) {}

  /**
   * Persists a recorded turn.
   *
   * @param data - The turn snapshot to store.
   * @returns The created domain turn.
   */
  async create(data: CreateTurnData): Promise<TurnEntity> {
    const orm = this.repository.create({
      bandId: data.bandId,
      year: data.year,
      fanCountSnapshot: data.fanCountSnapshot,
      balanceSnapshot: data.balanceSnapshot,
      passiveEventId: data.passiveEventId,
      activeEventId: data.activeEventId,
    });
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Lists a band's turns in chronological order (oldest first).
   *
   * @param bandId - The band id.
   * @returns The band's recorded domain turns.
   */
  async findByBandId(bandId: string): Promise<TurnEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "ASC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Maps a raw ORM record to a clean domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link TurnEntity}.
   */
  private toDomain(orm: TurnOrmEntity): TurnEntity {
    return new TurnEntity(
      orm.id,
      orm.bandId,
      orm.year,
      orm.fanCountSnapshot,
      orm.balanceSnapshot,
      orm.passiveEventId,
      orm.activeEventId,
      orm.createdAt,
    );
  }
}
