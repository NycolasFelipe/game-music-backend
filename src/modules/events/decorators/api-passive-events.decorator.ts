import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { GeneratePassiveEventsDto } from "@/modules/events/presentation/http/dto/generate-passive-events.dto";

/**
 * Swagger docs for generating passive events.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGeneratePassiveEvents() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({
      summary: "Generate passive (timeline) events for a band at a year",
    }),
    ApiBody({ type: GeneratePassiveEventsDto }),
    ApiCreatedResponse({ description: "The generated passive events." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for listing passive events.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListPassiveEvents() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({ summary: "List a band's passive (timeline) events" }),
    ApiOkResponse({ description: "The band's passive events." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
