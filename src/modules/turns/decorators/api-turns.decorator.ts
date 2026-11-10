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
        "the turn. Refused while the band has unresolved active events. " +
        "The `report` field explains the turn's money (ADR-0020): cash " +
        "before and after the tick, royalties per release, salaries paid " +
        "and the change in cash and fans since the previous turn.",
    }),
    ApiOkResponse({
      description:
        "The new clock, any events produced and the turn report " +
        "(`balanceAfter = balanceBefore + royalties - salariesPaid`).",
    }),
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

/**
 * Swagger docs for reading the turn panel.
 *
 * @returns The composed set of Swagger decorators.
 */
export function ApiGetTurnPanel() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParam({ name: "bandId", format: "uuid" }),
    ApiOperation({
      summary: "Read the turn panel (pending items, previews and forecast)",
      description:
        "Everything the turn screen needs in one read (ADR-0022): the items " +
        "waiting on the player (`active-event` and `studio-session` block the " +
        "advance; `release-ready` does not), the season already played and " +
        "one expected season per circuit (variance-neutral), whether a " +
        "get-together was held this semester, the work in the studio with " +
        "the market saturation of the next launch, and the forecast of the " +
        "next advance (royalties, automatic raises, payroll, final cash, " +
        "members left unpaid or leaving). Writes nothing.",
    }),
    ApiOkResponse({ description: "The turn panel." }),
    ApiNotFoundResponse({ description: "Band not found for this owner." }),
  );
}
