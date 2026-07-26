import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";

/**
 * TypeORM persistence model for the `band_gigs` table — the append-only history
 * of live seasons (ADR-0016 §6). Rows cascade-delete with their band.
 */
@Entity({ name: "band_gigs" })
export class GigOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "gig_type_id", type: "varchar", length: 32 })
  gigTypeId: string;

  @Column({
    name: "played_at_year",
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  playedAtYear: number;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  fee: number;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  cost: number;

  @Column({ name: "fans_gained", type: "integer", default: 0 })
  fansGained: number;

  @Column({
    type: "numeric",
    precision: 4,
    scale: 2,
    transformer: numericTransformer,
  })
  performance: number;

  @Column({
    name: "happiness_delta",
    type: "numeric",
    precision: 4,
    scale: 2,
    transformer: numericTransformer,
  })
  happinessDelta: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
