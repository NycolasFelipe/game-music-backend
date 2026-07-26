import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { UserPreferencesView } from "@/modules/users/application/dto/user-preferences.view";
import { UpdateUserPreferencesDto } from "@/modules/users/presentation/http/dto/update-user-preferences.dto";

/**
 * Swagger docs for reading the signed-in user's preferences.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetUserPreferences() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Read the signed-in user's account preferences" }),
    ApiOkResponse({ type: UserPreferencesView }),
    ApiNotFoundResponse({ description: "User not found." }),
  );
}

/**
 * Swagger docs for updating the signed-in user's preferences.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiUpdateUserPreferences() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Update the signed-in user's account preferences",
    }),
    ApiBody({ type: UpdateUserPreferencesDto }),
    ApiOkResponse({ type: UserPreferencesView }),
    ApiNotFoundResponse({ description: "User not found." }),
  );
}
