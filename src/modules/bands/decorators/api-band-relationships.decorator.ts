import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { SetRelationshipLevelDto } from "@/modules/bands/presentation/http/dto/set-relationship-level.dto";

/**
 * Swagger docs for listing a band's relationships.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListBandRelationships() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({
      summary: "List the relationships between a band's members",
    }),
    ApiOkResponse({ description: "The band's relationships." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for setting a relationship level.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiSetBandRelationshipLevel() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({ summary: "Set the level between two members (upsert)" }),
    ApiBody({ type: SetRelationshipLevelDto }),
    ApiOkResponse({ description: "The updated relationship." }),
    ApiNotFoundResponse({
      description: "Band not found, or a member is not in the band.",
    }),
  );
}
