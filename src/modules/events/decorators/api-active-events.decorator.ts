import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { GenerateActiveEventDto } from "@/modules/events/presentation/http/dto/generate-active-event.dto";
import { ResolveActiveEventDto } from "@/modules/events/presentation/http/dto/resolve-active-event.dto";

function bandIdParam() {
  return ApiParam({ name: "bandId", format: "uuid" });
}

function eventIdParam() {
  return ApiParam({ name: "eventId", format: "uuid" });
}

/**
 * Swagger docs for generating an active event.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGenerateActiveEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    ApiOperation({ summary: "Generate an eligible active event for a band" }),
    ApiBody({ type: GenerateActiveEventDto }),
    ApiCreatedResponse({ description: "The generated (pending) event." }),
    ApiNotFoundResponse({
      description: "Band not found, or no eligible event could be generated.",
    }),
  );
}

/**
 * Swagger docs for listing a band's events.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListActiveEvents() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    ApiOperation({ summary: "List a band's active events" }),
    ApiOkResponse({ description: "The band's events." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for fetching one event.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetActiveEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    eventIdParam(),
    ApiOperation({ summary: "Get one active event of a band" }),
    ApiOkResponse({ description: "The event." }),
    ApiNotFoundResponse({ description: "Band or event not found." }),
  );
}

/**
 * Swagger docs for resolving an event.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiResolveActiveEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    eventIdParam(),
    ApiOperation({
      summary: "Resolve an event by choosing an option (applies consequences)",
    }),
    ApiBody({ type: ResolveActiveEventDto }),
    ApiOkResponse({ description: "The resolved event and applied changes." }),
    ApiNotFoundResponse({ description: "Band, event or option not found." }),
    ApiConflictResponse({ description: "The event was already resolved." }),
  );
}
