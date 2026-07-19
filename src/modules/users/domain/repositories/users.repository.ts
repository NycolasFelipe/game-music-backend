import { UserEntity } from "../entities/user.entity";

/** DI token for the users repository implementation. */
export const USERS_REPOSITORY = Symbol("USERS_REPOSITORY");

/** Data required to persist a new user. */
export interface CreateUserData {
  username: string;
  passwordHash: string;
}

/**
 * Persistence contract for users. Implemented in the infrastructure layer and
 * injected into use cases via the {@link USERS_REPOSITORY} token.
 */
export interface UsersRepository {
  /**
   * Finds a user by their unique username.
   *
   * @param username - The username to look up.
   * @returns The matching user, or `null` when none exists.
   */
  findByUsername(username: string): Promise<UserEntity | null>;

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The user id (uuid) to look up.
   * @returns The matching user, or `null` when none exists.
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * Persists a new user.
   *
   * @param data - The username and password hash to store.
   * @returns The newly created user.
   */
  create(data: CreateUserData): Promise<UserEntity>;
}
