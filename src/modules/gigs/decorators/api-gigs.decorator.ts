import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { PlayGigDto } from "@/modules/gigs/presentation/http/dto/play-gig.dto";

/**
 * Swagger docs for listing the live-circuit catalog.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListGigTypes() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "List the live circuits (fame gate, fee, cost, fans)",
    }),
    ApiOkResponse({ description: "The live-circuit catalog." }),
  );
}

/**
 * Swagger docs for playing a live season.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiPlayGig() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Play the band's live season on a circuit" }),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiBody({ type: PlayGigDto }),
    ApiCreatedResponse({ description: "The season and the band's new state." }),
    ApiBadRequestResponse({
      description: "Fame level or cash does not allow this circuit.",
    }),
    ApiConflictResponse({
      description: "The band already played its season this turn.",
    }),
    ApiNotFoundResponse({ description: "Band or circuit not found." }),
  );
}

/**
 * Swagger docs for listing a band's played seasons.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListGigs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "List the band's played live seasons" }),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOkResponse({ description: "The band's gig history." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
