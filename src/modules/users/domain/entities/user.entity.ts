/**
 * Domain representation of a user. Kept free of any ORM/framework concerns so
 * the domain layer stays independent of infrastructure.
 */
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
