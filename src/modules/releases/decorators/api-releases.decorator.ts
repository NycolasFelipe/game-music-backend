import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { GenerateReleaseConceptDto } from "@/modules/releases/presentation/http/dto/generate-release-concept.dto";
import { GenerateReleaseTitleDto } from "@/modules/releases/presentation/http/dto/generate-release-title.dto";
import { ResolveCreationEventDto } from "@/modules/releases/presentation/http/dto/resolve-creation-event.dto";
import { StartReleaseDto } from "@/modules/releases/presentation/http/dto/start-release.dto";

/**
 * Swagger docs for listing release formats.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListReleaseFormats() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "List release formats (single, EP, LP, album, …)",
    }),
    ApiOkResponse({ description: "The format catalog with economics." }),
  );
}

/**
 * Swagger docs for listing budget tiers.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListBudgetTiers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "List budget tiers (cost × quality lever)" }),
    ApiOkResponse({ description: "The budget-tier catalog." }),
  );
}

/**
 * Swagger docs for generating release titles.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGenerateReleaseTitle() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Generate release-title suggestions" }),
    ApiBody({ type: GenerateReleaseTitleDto }),
    ApiOkResponse({ description: "The generated title suggestions." }),
  );
}

/**
 * Swagger docs for generating a release concept.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGenerateReleaseConcept() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Generate a concept-album description" }),
    ApiBody({ type: GenerateReleaseConceptDto }),
    ApiOkResponse({ description: "The generated concept." }),
  );
}

/**
 * Swagger docs for listing a band's discography.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListReleases() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({ summary: "List a band's releases (discography)" }),
    ApiOkResponse({ description: "The band's releases (newest first)." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for starting a release draft.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiStartRelease() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({
      summary: "Start a release draft (title/style/format/credits)",
    }),
    ApiBody({ type: StartReleaseDto }),
    ApiCreatedResponse({ description: "The created draft." }),
    ApiBadRequestResponse({
      description: "Invalid format/budget/credits, or insufficient balance.",
    }),
    ApiConflictResponse({
      description: "The band already has a release in creation.",
    }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for fetching a release with its creation events.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetRelease() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiOperation({ summary: "Get a release with its creation events" }),
    ApiOkResponse({ description: "The release with its creation events." }),
    ApiNotFoundResponse({ description: "Band or release not found." }),
  );
}

/**
 * Swagger docs for resolving a creation event.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiResolveCreationEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiParam({ name: "eventId", format: "uuid" }),
    ApiOperation({ summary: "Resolve a creation event (choose an option)" }),
    ApiBody({ type: ResolveCreationEventDto }),
    ApiOkResponse({ description: "The release with its updated events." }),
    ApiBadRequestResponse({ description: "Unknown option." }),
    ApiConflictResponse({
      description: "The event was already resolved, or the work was launched.",
    }),
    ApiNotFoundResponse({ description: "Band, release or event not found." }),
  );
}

/**
 * Swagger docs for finalizing (launching) a release.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiFinalizeRelease() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiOperation({ summary: "Finalize and launch a release" }),
    ApiOkResponse({ description: "The launched release." }),
    ApiBadRequestResponse({ description: "Insufficient balance to finalize." }),
    ApiConflictResponse({ description: "The release was already launched." }),
    ApiNotFoundResponse({ description: "Band or release not found." }),
  );
}

/**
 * Swagger docs for cancelling (discarding) a release draft.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiCancelRelease() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiParam({ name: "id", format: "uuid" }),
    ApiOperation({ summary: "Discard a release draft" }),
    ApiNoContentResponse({ description: "The draft was discarded." }),
    ApiConflictResponse({
      description: "A launched release cannot be discarded.",
    }),
    ApiNotFoundResponse({ description: "Band or release not found." }),
  );
}
