import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import {
  PEOPLE_VIEW_MODES,
  type PeopleViewMode,
} from "@/modules/users/domain/constants/user-preferences.constant";

/**
 * HTTP request body for updating account preferences (ADR-0018). Every field is
 * optional: a `PATCH` touches only what it names.
 */
export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ enum: PEOPLE_VIEW_MODES, example: "graph" })
  @IsOptional()
  @IsIn(PEOPLE_VIEW_MODES as readonly string[])
  peopleView?: PeopleViewMode;
}
