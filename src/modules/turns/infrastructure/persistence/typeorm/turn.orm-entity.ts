import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";

/**
 * TypeORM persistence model for the `turns` table: the per-band turn history.
 */
@Entity({ name: "turns" })
export class TurnOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  year: number;

  @Column({ name: "fan_count_snapshot", type: "integer" })
  fanCountSnapshot: number;

  @Column({ name: "passive_event_id", type: "uuid", nullable: true })
  passiveEventId: string | null;

  @Column({ name: "active_event_id", type: "uuid", nullable: true })
  activeEventId: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
