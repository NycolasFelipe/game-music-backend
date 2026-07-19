/** DI token for the password hasher implementation. */
export const PASSWORD_HASHER = Symbol("PASSWORD_HASHER");

/**
 * Abstraction over password hashing so use cases stay decoupled from the
 * concrete algorithm and are easy to unit test.
 */
export interface PasswordHasher {
  /**
   * Hashes a plaintext password.
   *
   * @param plain - The plaintext password.
   * @returns The resulting hash.
   */
  hash(plain: string): Promise<string>;

  /**
   * Verifies a plaintext password against a hash.
   *
   * @param plain - The plaintext password to check.
   * @param hash - The previously stored hash.
   * @returns `true` when the password matches, otherwise `false`.
   */
  compare(plain: string, hash: string): Promise<boolean>;
}
