import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginDto } from "../presentation/http/dto/login.dto";

/**
 * Swagger documentation for the login endpoint.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: "Authenticate with username/password and receive a JWT",
    }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description: "Authentication succeeded; returns an access token.",
    }),
    ApiUnauthorizedResponse({ description: "Invalid credentials." }),
  );
}

/**
 * Swagger documentation for the current-user endpoint.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetCurrentUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Return the currently authenticated user" }),
    ApiResponse({ status: 200, description: "The authenticated user." }),
    ApiUnauthorizedResponse({ description: "Missing or invalid token." }),
  );
}
