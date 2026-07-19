import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import {
  BandMembersRepository,
  CreateBandMemberData,
  UpdateBandMemberData,
} from "@/modules/band-members/domain/repositories/band-members.repository";
import { toBandMemberDomain } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.mapper";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";

/**
 * TypeORM-backed implementation of {@link BandMembersRepository}.
 */
@Injectable()
export class BandMembersTypeormRepository implements BandMembersRepository {
  constructor(
    @InjectRepository(BandMemberOrmEntity)
    private readonly repository: Repository<BandMemberOrmEntity>,
  ) {}

  /**
   * Persists a new member for a band.
   *
   * @param data - The member data, including the target band id.
   * @returns The newly created domain member.
   */
  async create(data: CreateBandMemberData): Promise<BandMemberEntity> {
    const orm = this.repository.create({
      bandId: data.bandId,
      name: data.name,
      age: data.age,
      gender: data.gender,
      avatar: data.avatar,
      happiness: data.happiness,
      characteristics: data.characteristics,
      skills: data.skills,
      biography: data.biography,
      primarySkill: data.primarySkill,
      joinYear: data.joinYear ?? null,
    });
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Lists all members of a band (oldest first).
   *
   * @param bandId - The band id.
   * @returns The band's domain members.
   */
  async findByBandId(bandId: string): Promise<BandMemberEntity[]> {
    const orms = await this.repository.find({
      where: { bandId },
      order: { createdAt: "ASC" },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  /**
   * Finds a member by id within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns The domain member, or `null` when not found in that band.
   */
  async findByIdAndBandId(
    id: string,
    bandId: string,
  ): Promise<BandMemberEntity | null> {
    const orm = await this.repository.findOne({ where: { id, bandId } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Counts the members of a band.
   *
   * @param bandId - The band id.
   * @returns The number of members.
   */
  countByBandId(bandId: string): Promise<number> {
    return this.repository.count({ where: { bandId } });
  }

  /**
   * Updates editable fields of a member within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @param changes - The editable fields to apply.
   * @returns The updated member, or `null` when not found in that band.
   */
  async update(
    id: string,
    bandId: string,
    changes: UpdateBandMemberData,
  ): Promise<BandMemberEntity | null> {
    const orm = await this.repository.findOne({ where: { id, bandId } });
    if (!orm) {
      return null;
    }

    Object.assign(orm, changes);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Deletes a member by id within a band.
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns `true` when a member was deleted, `false` otherwise.
   */
  async deleteByIdAndBandId(id: string, bandId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, bandId });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Maps a raw ORM record to a clean domain entity via the shared mapper.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding {@link BandMemberEntity}.
   */
  private toDomain(orm: BandMemberOrmEntity): BandMemberEntity {
    return toBandMemberDomain(orm);
  }
}
