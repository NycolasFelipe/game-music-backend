import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type { Gender } from "@/modules/band-members/domain/constants/gender.constant";
import type {
  Skills,
  SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * TypeORM persistence model for the `band_members` table. Infrastructure-only;
 * mapped to {@link BandMemberEntity} via the repository's `toDomain()`.
 */
@Entity({ name: "band_members" })
export class BandMemberOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "smallint" })
  age: number;

  @Column({ type: "varchar", length: 16 })
  gender: Gender;

  @Column({
    type: "numeric",
    precision: 4,
    scale: 2,
    default: 0,
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

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
