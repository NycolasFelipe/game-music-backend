import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { HoldActivityDto } from "@/modules/activities/presentation/http/dto/hold-activity.dto";

/**
 * Swagger docs for listing the activities priced for a band.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListActivityOptions() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "List the activities on offer, priced for this band",
    }),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOkResponse({
      description: "The priced catalog and this turn's effect multiplier.",
    }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for holding an activity.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiHoldActivity() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Hold an activity with a chosen guest list" }),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiBody({ type: HoldActivityDto }),
    ApiCreatedResponse({
      description: "What the activity changed, and the trouble it raised.",
    }),
    ApiBadRequestResponse({
      description: "Guest list out of bounds, unknown member or short cash.",
    }),
    ApiNotFoundResponse({ description: "Band or activity not found." }),
  );
}

/**
 * Swagger docs for listing a band's held activities.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListBandActivities() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "List the activities the band has held" }),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOkResponse({ description: "The band's activity history." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
