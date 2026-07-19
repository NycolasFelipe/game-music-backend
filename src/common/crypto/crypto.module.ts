import { Module } from "@nestjs/common";
import { BcryptPasswordHasher } from "./bcrypt-password-hasher";
import { PASSWORD_HASHER } from "./password-hasher";

/**
 * Shared cryptography module. Exposes the password hasher (via
 * {@link PASSWORD_HASHER}) to any module that needs to hash/verify secrets.
 */
@Module({
  providers: [
    BcryptPasswordHasher,
    { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
  ],
  exports: [PASSWORD_HASHER],
})
export class CryptoModule {}
