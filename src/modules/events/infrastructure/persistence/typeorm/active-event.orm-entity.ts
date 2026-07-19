import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type {
  EventConsequence,
  ResolvedEventOption,
} from "@/modules/events/domain/types/event-consequence";

/**
 * TypeORM persistence model for the `active_events` table.
 */
@Entity({ name: "active_events" })
export class ActiveEventOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "template_id", type: "varchar", length: 128 })
  templateId: string;

  @Column({
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  year: number;

  @Column({ type: "varchar", length: 64, default: "" })
  type: ActiveEventType;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({
    name: "involved_character_ids",
    type: "text",
    array: true,
    default: () => "'{}'",
  })
  involvedCharacterIds: string[];

  @Column({ type: "jsonb" })
  options: ResolvedEventOption[];

  @Column({ type: "boolean", default: false })
  resolved: boolean;

  @Column({
    name: "chosen_option_id",
    type: "varchar",
    length: 64,
    nullable: true,
  })
  chosenOptionId: string | null;

  @Column({ type: "jsonb", nullable: true })
  outcome: EventConsequence | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @Column({ name: "resolved_at", type: "timestamptz", nullable: true })
  resolvedAt: Date | null;
}
