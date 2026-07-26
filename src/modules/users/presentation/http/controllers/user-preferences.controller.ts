import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { UserPreferencesView } from "@/modules/users/application/dto/user-preferences.view";
import { GetUserPreferencesUseCase } from "@/modules/users/application/use-cases/get-user-preferences.use-case";
import { UpdateUserPreferencesUseCase } from "@/modules/users/application/use-cases/update-user-preferences.use-case";
import {
  ApiGetUserPreferences,
  ApiUpdateUserPreferences,
} from "@/modules/users/decorators/api-user-preferences.decorator";
import { UpdateUserPreferencesDto } from "@/modules/users/presentation/http/dto/update-user-preferences.dto";

/**
 * HTTP endpoints for account-level preferences (ADR-0018). Always scoped to the
 * signed-in user — there is no path parameter to get wrong.
 */
@ApiTags("users")
@Controller("users/me/preferences")
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(
    private readonly getUserPreferencesUseCase: GetUserPreferencesUseCase,
    private readonly updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
  ) {}

  /**
   * Reads the signed-in user's preferences.
   *
   * @param actor - The authenticated user.
   * @returns The user's preferences.
   */
  @Get()
  @ApiGetUserPreferences()
  get(
    @CurrentUser() actor: AuthenticatedUserEntity,
  ): Promise<UserPreferencesView> {
    return this.getUserPreferencesUseCase.execute(actor);
  }

  /**
   * Updates the signed-in user's preferences.
   *
   * @param actor - The authenticated user.
   * @param dto - The settings to change.
   * @returns The preferences as they now stand.
   */
  @Patch()
  @ApiUpdateUserPreferences()
  update(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesView> {
    return this.updateUserPreferencesUseCase.execute(actor, {
      peopleView: dto.peopleView,
    });
  }
}
