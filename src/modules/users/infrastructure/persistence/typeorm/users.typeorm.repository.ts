import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  mergeUserPreferences,
  type UserPreferences,
} from "@/modules/users/domain/constants/user-preferences.constant";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import {
  CreateUserData,
  UsersRepository,
} from "@/modules/users/domain/repositories/users.repository";
import { UserOrmEntity } from "./user.orm-entity";

/**
 * TypeORM-backed implementation of {@link UsersRepository}.
 */
@Injectable()
export class UsersTypeormRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  /**
   * Finds a user by their unique username.
   *
   * @param username - The username to look up.
   * @returns The matching domain user, or `null` when none exists.
   */
  async findByUsername(username: string): Promise<UserEntity | null> {
    const orm = await this.repository.findOne({ where: { username } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The user id (uuid) to look up.
   * @returns The matching domain user, or `null` when none exists.
   */
  async findById(id: string): Promise<UserEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  /**
   * Persists a new user.
   *
   * @param data - The username and password hash to store.
   * @returns The newly created domain user.
   */
  async create(data: CreateUserData): Promise<UserEntity> {
    const orm = this.repository.create({
      username: data.username,
      passwordHash: data.passwordHash,
    });
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Replaces a user's account-level preferences.
   *
   * @param id - The user id.
   * @param preferences - The complete, already-validated preferences.
   * @returns The updated domain user, or `null` when no such user exists.
   */
  async updatePreferences(
    id: string,
    preferences: UserPreferences,
  ): Promise<UserEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) return null;

    orm.preferences = preferences;
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  /**
   * Maps a raw ORM record to a clean domain entity. Stored preferences are
   * merged onto the defaults, so a row written before a new setting existed
   * still yields a complete object.
   *
   * @param orm - The persistence model loaded from the database.
   * @returns The corresponding domain {@link UserEntity}.
   */
  private toDomain(orm: UserOrmEntity): UserEntity {
    return new UserEntity(
      orm.id,
      orm.username,
      orm.passwordHash,
      mergeUserPreferences(orm.preferences, {}),
      orm.createdAt,
      orm.updatedAt,
    );
  }
}
