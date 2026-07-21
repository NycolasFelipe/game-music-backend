import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { numericTransformer } from "@/common/persistence/numeric.transformer";
import type { SalaryChangeReason } from "@/modules/band-members/domain/constants/salary.constant";

/**
 * TypeORM persistence model for the `member_salaries` table — the append-only
 * salary history / renegotiation log (ADR-0010 §1). Rows cascade-delete with
 * their member (and, transitively, their band).
 */
@Entity({ name: "member_salaries" })
export class MemberSalaryOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "member_id", type: "uuid" })
  memberId: string;

  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @Column({
    name: "effective_year",
    type: "numeric",
    precision: 6,
    scale: 1,
    transformer: numericTransformer,
  })
  effectiveYear: number;

  @Column({ type: "varchar", length: 32 })
  reason: SalaryChangeReason;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
