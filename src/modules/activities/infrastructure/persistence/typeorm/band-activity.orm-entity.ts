import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";

/**
 * TypeORM persistence model for the `band_activities` table — the append-only
 * history of confraternizações (ADR-0017 §5). Rows cascade-delete with their
 * band.
 */
@Entity({ name: "band_activities" })
export class BandActivityOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "activity_id", type: "varchar", length: 32 })
  activityId: string;

  @Column({
    name: "held_at_year",
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  heldAtYear: number;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  cost: number;

  @Column({ name: "participant_ids", type: "jsonb", default: () => "'[]'" })
  participantIds: string[];

  @Column({
    name: "happiness_delta",
    type: "numeric",
    precision: 4,
    scale: 2,
    transformer: numericTransformer,
  })
  happinessDelta: number;

  @Column({ name: "relationship_delta", type: "smallint", default: 0 })
  relationshipDelta: number;

  @Column({ type: "boolean", default: false })
  trouble: boolean;

  @Column({ name: "trouble_event_id", type: "uuid", nullable: true })
  troubleEventId: string | null;

  @Column({ type: "jsonb", default: () => "'[]'" })
  story: string[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
