import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { CreateBandMemberSeedDto } from "@/modules/bands/presentation/http/dto/create-band-member-seed.dto";
import { GenerateCandidatesDto } from "@/modules/band-members/presentation/http/dto/generate-candidates.dto";
import { UpdateBandMemberDto } from "@/modules/band-members/presentation/http/dto/update-band-member.dto";

/** `bandId` path parameter shared by the nested member routes. */
function bandIdParam() {
  return ApiParam({ name: "bandId", format: "uuid" });
}

/** `memberId` path parameter shared by the nested member routes. */
function memberIdParam() {
  return ApiParam({ name: "memberId", format: "uuid" });
}

/**
 * Swagger docs for generating member candidates.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGenerateCandidates() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Generate member candidates (not persisted)" }),
    ApiBody({ type: GenerateCandidatesDto }),
    ApiOkResponse({ description: "The generated candidates." }),
  );
}

/**
 * Swagger docs for listing the characteristic (trait) catalog.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListCharacteristics() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "List the member characteristic (trait) catalog" }),
    ApiOkResponse({ description: "The trait catalog with display data." }),
  );
}

/**
 * Swagger docs for listing the per-skill level descriptions.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListSkillDescriptions() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "List per-skill level descriptions (flavor text)",
    }),
    ApiOkResponse({ description: "The level descriptions keyed by skill." }),
  );
}

/**
 * Swagger docs for adding a member to a band.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiAddBandMember() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    ApiOperation({ summary: "Add a member to a band" }),
    ApiBody({ type: CreateBandMemberSeedDto }),
    ApiCreatedResponse({ description: "The created member." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
    ApiConflictResponse({ description: "The band is already full." }),
  );
}

/**
 * Swagger docs for listing a band's members.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiListBandMembers() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    ApiOperation({ summary: "List a band's members" }),
    ApiOkResponse({ description: "The band's members." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}

/**
 * Swagger docs for fetching one member.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetBandMember() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    memberIdParam(),
    ApiOperation({ summary: "Get one member of a band" }),
    ApiOkResponse({ description: "The member." }),
    ApiNotFoundResponse({ description: "Band or member not found." }),
  );
}

/**
 * Swagger docs for updating a member.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiUpdateBandMember() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    memberIdParam(),
    ApiOperation({ summary: "Update a member's editable fields" }),
    ApiBody({ type: UpdateBandMemberDto }),
    ApiOkResponse({ description: "The updated member." }),
    ApiNotFoundResponse({ description: "Band or member not found." }),
  );
}

/**
 * Swagger docs for removing a member.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiRemoveBandMember() {
  return applyDecorators(
    ApiBearerAuth(),
    bandIdParam(),
    memberIdParam(),
    ApiOperation({ summary: "Remove a member from a band" }),
    ApiNoContentResponse({ description: "The member was removed." }),
    ApiNotFoundResponse({ description: "Band or member not found." }),
  );
}
