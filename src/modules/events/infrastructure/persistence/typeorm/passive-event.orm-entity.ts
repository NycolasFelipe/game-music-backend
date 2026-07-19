import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";

/**
 * TypeORM persistence model for the `passive_events` table.
 */
@Entity({ name: "passive_events" })
export class PassiveEventOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "template_id", type: "varchar", length: 64 })
  templateId: string;

  @Column({
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  year: number;

  @Column({ type: "varchar", length: 64 })
  type: PassiveEventType;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  artists: string[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
