import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import type {
  DepartureReason,
  FormerMemberRelationship,
} from "@/modules/band-members/domain/entities/former-member.entity";

/**
 * TypeORM persistence model for the `former_members` table — a snapshot of a
 * departed member (ADR-0010). Infrastructure-only; mapped to
 * {@link FormerMemberEntity} via the repository.
 */
@Entity({ name: "former_members" })
export class FormerMemberOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "original_member_id", type: "uuid" })
  originalMemberId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "smallint" })
  age: number;

  @Column({ type: "varchar", length: 16 })
  gender: Gender;

  @Column({ type: "varchar", length: 32 })
  avatar: string;

  @Column({
    type: "numeric",
    precision: 4,
    scale: 2,
    transformer: numericTransformer,
  })
  happiness: number;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  characteristics: string[];

  @Column({ type: "jsonb" })
  skills: Skills;

  @Column({ type: "text" })
  biography: string;

  @Column({ name: "primary_skill", type: "varchar", length: 16 })
  primarySkill: SkillType;

  @Column({ name: "join_year", type: "smallint", nullable: true })
  joinYear: number | null;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  salary: number;

  @Column({ name: "unpaid_turns", type: "smallint" })
  unpaidTurns: number;

  @Column({ type: "varchar", length: 32 })
  reason: DepartureReason;

  @Column({
    name: "left_at_year",
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  leftAtYear: number;

  @Column({ type: "jsonb", default: () => "'[]'" })
  relationships: FormerMemberRelationship[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
