import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { UserPreferences } from "@/modules/users/domain/constants/user-preferences.constant";

/**
 * TypeORM persistence model for the `users` table. This type lives strictly in
 * the infrastructure layer and is never returned from repositories directly —
 * repositories map it to {@link UserEntity} via `toDomain()`.
 */
@Entity({ name: "users" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  username: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash: string;

  /** Account-level settings (ADR-0018), a `jsonb` blob with a known schema. */
  @Column({ type: "jsonb", default: () => "'{}'" })
  preferences: Partial<UserPreferences>;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
