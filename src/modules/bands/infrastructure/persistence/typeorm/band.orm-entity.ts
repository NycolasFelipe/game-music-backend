import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";

/**
 * TypeORM persistence model for the `bands` table. Infrastructure-only; mapped
 * to {@link BandEntity} via the repository's `toDomain()`.
 */
@Entity({ name: "bands" })
export class BandOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "owner_id", type: "uuid" })
  ownerId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 64 })
  theme: BandTheme;

  @Column({ type: "varchar", length: 64 })
  origin: OriginCity;

  @Column({ name: "foundation_year", type: "smallint" })
  foundationYear: FoundationYear;

  @Column({ name: "fan_count", type: "integer", default: 0 })
  fanCount: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
