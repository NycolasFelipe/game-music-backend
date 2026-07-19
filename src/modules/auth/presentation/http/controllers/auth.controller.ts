import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../../../common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "../../../../../common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "../../../../../common/guards/jwt-auth.guard";
import { AuthResultDto } from "../../../application/dto/auth-result.dto";
import { LoginUseCase } from "../../../application/use-cases/login.use-case";
import {
  ApiGetCurrentUser,
  ApiLogin,
} from "../../../decorators/api-auth.decorator";
import { LoginDto } from "../dto/login.dto";

/**
 * HTTP endpoints for authentication.
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  /**
   * Authenticates a user and returns a signed access token.
   *
   * @param dto - The validated login credentials.
   * @returns The access token and public user data.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  login(@Body() dto: LoginDto): Promise<AuthResultDto> {
    return this.loginUseCase.execute({
      username: dto.username,
      password: dto.password,
    });
  }

  /**
   * Returns the currently authenticated user, derived from the Bearer token.
   *
   * @param user - The authenticated actor injected by {@link JwtAuthGuard}.
   * @returns The authenticated user.
   */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiGetCurrentUser()
  me(@CurrentUser() user: AuthenticatedUserEntity): AuthenticatedUserEntity {
    return user;
  }
}
