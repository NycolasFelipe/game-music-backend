import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type {
  CreationEventKind,
  CreationEventOption,
} from "@/modules/releases/domain/types/creation-event";

/**
 * TypeORM persistence model for the `release_creation_events` table (mirrors
 * `active_events`). Belongs to a single release via {@link releaseId}.
 */
@Entity({ name: "release_creation_events" })
export class ReleaseCreationEventOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "release_id", type: "uuid" })
  releaseId: string;

  @Column({ type: "integer" })
  sequence: number;

  @Column({ type: "varchar", length: 32 })
  kind: CreationEventKind;

  @Column({ type: "text" })
  prompt: string;

  @Column({ type: "jsonb" })
  options: CreationEventOption[];

  @Column({ type: "boolean", default: false })
  resolved: boolean;

  @Column({
    name: "chosen_option_id",
    type: "varchar",
    length: 64,
    nullable: true,
  })
  chosenOptionId: string | null;

  @Column({
    name: "quality_modifier",
    type: "numeric",
    precision: 5,
    scale: 3,
    nullable: true,
    transformer: numericTransformer,
  })
  qualityModifier: number | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
