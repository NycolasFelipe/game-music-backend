import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PASSWORD_HASHER } from "../../../../common/crypto/password-hasher";
import type { PasswordHasher } from "../../../../common/crypto/password-hasher";
import { USERS_REPOSITORY } from "../../../users/domain/repositories/users.repository";
import type { UsersRepository } from "../../../users/domain/repositories/users.repository";
import { AuthResultDto } from "../dto/auth-result.dto";
import { LoginInput } from "../dto/login.input";

/**
 * Authenticates a user with username/password credentials and issues a JWT.
 */
@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Verifies the supplied credentials and returns a signed access token.
   *
   * Flow: look up the user by username, verify the password against the stored
   * hash, then sign a JWT carrying the user id (`sub`) and username. A missing
   * user and a wrong password both yield the same generic error to avoid user
   * enumeration.
   *
   * @param input - The username and plaintext password to authenticate.
   * @returns The access token and the public user representation.
   * @throws {UnauthorizedException} When credentials are invalid.
   */
  async execute(input: LoginInput): Promise<AuthResultDto> {
    const user = await this.usersRepository.findByUsername(input.username);

    if (!user) {
      this.logger.warn(`Login failed: user "${input.username}" not found`);
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      this.logger.warn(
        `Login failed: invalid password for user "${input.username}"`,
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
      user: { id: user.id, username: user.username },
    };
  }
}
