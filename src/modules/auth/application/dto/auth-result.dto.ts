import { AuthenticatedUserDto } from "./authenticated-user.dto";

/**
 * Result of a successful authentication: a signed JWT plus the public user.
 */
export class AuthResultDto {
  accessToken: string;
  user: AuthenticatedUserDto;
}
