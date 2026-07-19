import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { CreateBandDto } from "@/modules/bands/presentation/http/dto/create-band.dto";

/**
 * Swagger docs for generating a band name.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGenerateBandName() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Generate a random band name suggestion" }),
    ApiOkResponse({ description: "A generated band name." }),
  );
}

/**
 * Swagger docs for listing band creation options.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiBandOptions() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "List band creation options (themes, origins, decades)",
    }),
    ApiOkResponse({
      description: "The available options with display labels.",
    }),
  );
}

/**
 * Swagger docs for creating a band.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiCreateBand() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Create a band with its initial members (3-6)" }),
    ApiBody({ type: CreateBandDto }),
    ApiCreatedResponse({ description: "The created band with its members." }),
  );
}

/**
 * Swagger docs for listing the owner's bands.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListBands() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "List the authenticated user's bands" }),
    ApiOkResponse({ description: "The owner's bands." }),
  );
}

/**
 * Swagger docs for fetching one band with its members.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetBand() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Get one band (with its members)" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiOkResponse({ description: "The band with its members." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for fetching a band's fame standing.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetBandFame() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Get a band's fame standing (derived from fans)" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiOkResponse({ description: "The band's fame view." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for deleting a band.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiDeleteBand() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Delete a band (cascades to its members)" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiNoContentResponse({ description: "The band was deleted." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
