import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";

/**
 * Swagger docs for advancing a turn.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiAdvanceTurn() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({
      summary: "Advance the band's clock by one turn (half a year)",
      description:
        "Runs the turn tick: generates a passive event, ages members on a " +
        "calendar-year rollover, may roll a blocking active event, and records " +
        "the turn. Refused while the band has unresolved active events.",
    }),
    ApiOkResponse({ description: "The new clock and any events produced." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
    ApiConflictResponse({
      description: "The band has unresolved active events.",
    }),
  );
}

/**
 * Swagger docs for listing a band's turns.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListTurns() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({ summary: "List a band's recorded turns (its timeline)" }),
    ApiOkResponse({ description: "The band's recorded turns, oldest first." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
