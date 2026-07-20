import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type {
  ReleaseCreationLogEntry,
  ReleaseCredits,
  ReleaseDetails,
  ReleaseStatus,
} from "@/modules/releases/domain/constants/release.constant";

/**
 * TypeORM persistence model for the `releases` table. Outcome columns are
 * nullable while the row is a draft (`em_criacao`).
 */
@Entity({ name: "releases" })
export class ReleaseOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", default: "" })
  concept: string;

  @Column({ type: "varchar", length: 32 })
  format: string;

  @Column({ type: "varchar", length: 64 })
  style: string;

  @Column({ name: "budget_tier", type: "varchar", length: 32 })
  budgetTier: string;

  @Column({ type: "varchar", length: 16, default: "em_criacao" })
  status: ReleaseStatus;

  @Column({ type: "jsonb", default: () => "'{}'" })
  credits: ReleaseCredits;

  @Column({
    type: "numeric",
    precision: 6,
    scale: 1,
    nullable: true,
    transformer: numericTransformer,
  })
  quality: number | null;

  @Column({ name: "quality_tier", type: "varchar", length: 32, nullable: true })
  qualityTier: string | null;

  @Column({ name: "fans_gained", type: "integer", nullable: true })
  fansGained: number | null;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  cost: number | null;

  @Column({
    name: "master_revenue_total",
    type: "numeric",
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  masterRevenueTotal: number | null;

  @Column({
    name: "publishing_revenue_total",
    type: "numeric",
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  publishingRevenueTotal: number | null;

  @Column({
    name: "royalty_remaining",
    type: "numeric",
    precision: 12,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  royaltyRemaining: number;

  @Column({ name: "royalty_turns_left", type: "integer", default: 0 })
  royaltyTurnsLeft: number;

  @Column({
    name: "released_at_year",
    type: "numeric",
    precision: 6,
    scale: 1,
    nullable: true,
    transformer: numericTransformer,
  })
  releasedAtYear: number | null;

  @Column({ name: "creation_log", type: "jsonb", default: () => "'[]'" })
  creationLog: ReleaseCreationLogEntry[];

  @Column({ type: "jsonb", nullable: true })
  details: ReleaseDetails | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
