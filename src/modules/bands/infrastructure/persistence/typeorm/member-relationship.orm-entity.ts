import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

/**
 * TypeORM persistence model for the `member_relationships` table. The pair is
 * stored in canonical order and is unique per `(member_a_id, member_b_id)`.
 */
@Entity({ name: "member_relationships" })
@Unique("UQ_member_relationships_pair", ["memberAId", "memberBId"])
export class MemberRelationshipOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: "band_id", type: "uuid" })
  bandId: string;

  @Column({ name: "member_a_id", type: "uuid" })
  memberAId: string;

  @Column({ name: "member_b_id", type: "uuid" })
  memberBId: string;

  @Column({ type: "smallint" })
  level: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
