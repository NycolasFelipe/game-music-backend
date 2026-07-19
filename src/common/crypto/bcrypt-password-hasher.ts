import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PasswordHasher } from "./password-hasher";

/**
 * bcryptjs-backed implementation of {@link PasswordHasher}.
 */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private readonly rounds = 10;

  /**
   * Hashes a plaintext password using bcrypt.
   *
   * @param plain - The plaintext password.
   * @returns The bcrypt hash.
   */
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  /**
   * Verifies a plaintext password against a bcrypt hash.
   *
   * @param plain - The plaintext password to check.
   * @param hash - The stored bcrypt hash.
   * @returns `true` when the password matches, otherwise `false`.
   */
  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
