import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { BandMemberEntity } from "@/modules/band-members/domain/entities/band-member.entity";
import { SalaryAgreementEntity } from "@/modules/band-members/domain/entities/salary-agreement.entity";
import {
  BandMembersRepository,
  CreateBandMemberData,
  SetSalaryData,
  UpdateBandMemberData,
} from "@/modules/band-members/domain/repositories/band-members.repository";
import {
  toBandMemberDomain,
  toSalaryAgreementDomain,
} from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.mapper";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { MemberSalaryOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/member-salary.orm-entity";

/**
 * TypeORM-backed implementation of {@link BandMembersRepository}.
 */
@Injectable()
export class BandMembersTypeormRepository implements BandMembersRepository {
  constructor(
    @InjectRepository(BandMemberOrmEntity)
    private readonly repository: Repository<BandMemberOrmEntity>,
    @InjectRepository(MemberSalaryOrmEntity)
    private readonly salariesRepository: Repository<MemberSalaryOrmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
      // `id` tiebreaker keeps the order stable across updates (members created in
      // the same transaction share a `created_at`).
      order: { createdAt: "ASC", id: "ASC" },
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
   * Sets a member's salary atomically: updates the current `salary` column and
   * appends the change to the salary history (ADR-0010 §1).
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @param data - The new amount, effective year and reason.
   * @returns The updated domain member, or `null` when not found in that band.
   */
  async setSalary(
    id: string,
    bandId: string,
    data: SetSalaryData,
  ): Promise<BandMemberEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const memberRepo = manager.getRepository(BandMemberOrmEntity);
      const orm = await memberRepo.findOne({ where: { id, bandId } });
      if (!orm) {
        return null;
      }

      orm.salary = data.amount;
      const saved = await memberRepo.save(orm);

      await manager.getRepository(MemberSalaryOrmEntity).save(
        manager.getRepository(MemberSalaryOrmEntity).create({
          memberId: id,
          bandId,
          amount: data.amount,
          effectiveYear: data.effectiveYear,
          reason: data.reason,
        }),
      );

      return this.toDomain(saved);
    });
  }

  /**
   * Lists a member's salary history (newest first).
   *
   * @param id - The member id.
   * @param bandId - The band id the member must belong to.
   * @returns The member's salary agreements (empty when none).
   */
  async findSalaryHistory(
    id: string,
    bandId: string,
  ): Promise<SalaryAgreementEntity[]> {
    const orms = await this.salariesRepository.find({
      where: { memberId: id, bandId },
      order: { createdAt: "DESC" },
    });
    return orms.map(toSalaryAgreementDomain);
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
