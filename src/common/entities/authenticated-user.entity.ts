/**
 * The authenticated actor extracted from a validated JWT and attached to the
 * request. Passed as the first argument to authenticated use cases.
 */
export class AuthenticatedUserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
  ) {}
}
