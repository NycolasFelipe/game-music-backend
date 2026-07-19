/**
 * Public representation of a user returned to clients. Never exposes the
 * password hash or other sensitive fields.
 */
export class AuthenticatedUserDto {
  id: string;
  username: string;
}
