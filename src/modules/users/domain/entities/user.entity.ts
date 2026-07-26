import type { UserPreferences } from "@/modules/users/domain/constants/user-preferences.constant";

/**
 * Domain representation of a user. Kept free of any ORM/framework concerns so
 * the domain layer stays independent of infrastructure.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly passwordHash: string,
    /** Account-level settings, valid across every save (ADR-0018). */
    public readonly preferences: UserPreferences,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
