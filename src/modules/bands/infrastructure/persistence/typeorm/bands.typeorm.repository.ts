import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { targetSalary } from "@/modules/band-members/domain/salary/salary.calculator";
import { toBandMemberDomain } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.mapper";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { MemberSalaryOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/member-salary.orm-entity";
import { BandWithMembers } from "@/modules/bands/domain/entities/band-with-members";
import { MemberRelationshipEntity } from "@/modules/bands/domain/entities/member-relationship.entity";
import { BandEntity } from "@/modules/bands/domain/entities/band.entity";
import { STARTING_CAPITAL } from "@/modules/bands/domain/constants/band.constant";
import { generateRelationshipsForMembers } from "@/modules/bands/domain/generation/relationship.generator";
import {
  AdvanceTurnInput,
  BandsRepository,
  BandStateChangesInput,
  CreateBandData,
  CreateBandMemberSeed,
} from "@/modules/bands/domain/repositories/bands.repository";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";
import { MemberRelationshipOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/member-relationship.orm-entity";

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
          currentYear: data.foundationYear,
          balance: data.balance ?? STARTING_CAPITAL,
        }),
      );

      const memberOrms = members.map((member) =>
        memberRepo.create({
          bandId: savedBand.id,
          name: member.name,
          age: member.age,
          gender: member.gender,
          avatar: member.avatar,
          happiness: member.happiness,
          characteristics: member.characteristics,
          skills: member.skills,
          biography: member.biography,
          primarySkill: member.primarySkill,
          joinYear: member.joinYear ?? null,
          // Initial salary = target salary at founding (ADR-0010 §3). Fan count
          // is 0 on creation, so the fame factor is neutral.
          salary: targetSalary(
            member.skills,
            member.characteristics,
            savedBand.fanCount,
          ),
        }),
      );
      const savedMembers = memberOrms.length
        ? await memberRepo.save(memberOrms)
        : [];

      // Seed each member's salary history with the initial agreement.
      const salaryRepo = manager.getRepository(MemberSalaryOrmEntity);
      if (savedMembers.length) {
        await salaryRepo.save(
          savedMembers.map((member) =>
            salaryRepo.create({
              memberId: member.id,
              bandId: savedBand.id,
              amount: member.salary,
              effectiveYear: savedBand.currentYear,
              reason: "inicial",
            }),
          ),
        );
      }

      const relationshipRepo = manager.getRepository(
        MemberRelationshipOrmEntity,
      );
      const relationshipOrms = generateRelationshipsForMembers(
        savedMembers.map((m) => m.id),
      ).map((rel) => relationshipRepo.create({ bandId: savedBand.id, ...rel }));
      const savedRelationships = relationshipOrms.length
        ? await relationshipRepo.save(relationshipOrms)
        : [];

      return {
        band: this.toDomain(savedBand),
        members: savedMembers.map(toBandMemberDomain),
        relationships: savedRelationships.map((r) =>
          this.relationshipToDomain(r),
        ),
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

    const relationshipOrms = await this.dataSource
      .getRepository(MemberRelationshipOrmEntity)
      .find({ where: { bandId: id }, order: { createdAt: "ASC" } });

    return {
      band: this.toDomain(orm),
      members: memberOrms.map(toBandMemberDomain),
      relationships: relationshipOrms.map((r) => this.relationshipToDomain(r)),
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
   * Applies absolute band-aggregate changes atomically (fan count, member
   * happiness, relationship levels).
   *
   * @param bandId - The band id.
   * @param changes - The absolute values to apply.
   * @returns A promise that resolves once applied.
   */
  async applyBandStateChanges(
    bandId: string,
    changes: BandStateChangesInput,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      if (changes.fanCount !== undefined) {
        await manager
          .getRepository(BandOrmEntity)
          .update({ id: bandId }, { fanCount: changes.fanCount });
      }

      if (changes.balance !== undefined) {
        await manager
          .getRepository(BandOrmEntity)
          .update({ id: bandId }, { balance: changes.balance });
      }

      for (const change of changes.memberHappiness ?? []) {
        await manager
          .getRepository(BandMemberOrmEntity)
          .update(
            { id: change.memberId, bandId },
            { happiness: change.happiness },
          );
      }

      for (const rel of changes.relationshipLevels ?? []) {
        await manager
          .getRepository(MemberRelationshipOrmEntity)
          .update(
            { bandId, memberAId: rel.memberAId, memberBId: rel.memberBId },
            { level: rel.level },
          );
      }

      for (const arrears of changes.memberSalaryArrears ?? []) {
        await manager
          .getRepository(BandMemberOrmEntity)
          .update(
            { id: arrears.memberId, bandId },
            { salaryUnpaidTurns: arrears.unpaidTurns },
          );
      }

      // Remove departed members last; cascades their relationships and salary
      // history (FKs `ON DELETE CASCADE`).
      if (changes.removedMemberIds?.length) {
        await manager
          .getRepository(BandMemberOrmEntity)
          .delete({ id: In(changes.removedMemberIds), bandId });
      }
    });
  }

  /**
   * Advances the band's live year and optionally ages its members, atomically.
   *
   * @param bandId - The band id.
   * @param changes - The new year and whether to age members this step.
   * @returns A promise that resolves once applied.
   */
  async advanceTurn(bandId: string, changes: AdvanceTurnInput): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager
        .getRepository(BandOrmEntity)
        .update({ id: bandId }, { currentYear: changes.newYear });

      if (changes.ageMembers) {
        await manager
          .getRepository(BandMemberOrmEntity)
          .increment({ bandId }, "age", 1);
      }
    });
  }

  /**
   * Averages the members' happiness and the relationship levels of a band.
   *
   * @param bandId - The band id.
   * @returns The average happiness and average relationship level (null when empty).
   */
  async getBandMemberAverages(bandId: string): Promise<{
    happinessAvg: number | null;
    relationshipAvg: number | null;
  }> {
    const members = await this.dataSource
      .getRepository(BandMemberOrmEntity)
      .find({ where: { bandId } });
    const relationships = await this.dataSource
      .getRepository(MemberRelationshipOrmEntity)
      .find({ where: { bandId } });

    const average = (values: number[]): number | null =>
      values.length
        ? Math.round(
            (values.reduce((sum, v) => sum + v, 0) / values.length) * 100,
          ) / 100
        : null;

    return {
      happinessAvg: average(members.map((m) => m.happiness)),
      relationshipAvg: average(relationships.map((r) => r.level)),
    };
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
      orm.currentYear,
      orm.balance,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  /**
   * Maps a raw relationship ORM record to its domain entity.
   *
   * @param orm - The persistence model.
   * @returns The corresponding {@link MemberRelationshipEntity}.
   */
  private relationshipToDomain(
    orm: MemberRelationshipOrmEntity,
  ): MemberRelationshipEntity {
    return new MemberRelationshipEntity(
      orm.id,
      orm.bandId,
      orm.memberAId,
      orm.memberBId,
      orm.level,
      orm.createdAt,
      orm.updatedAt,
    );
  }
}
