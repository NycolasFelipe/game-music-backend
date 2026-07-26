import { ApiProperty } from "@nestjs/swagger";
import {
  PEOPLE_VIEW_MODES,
  type PeopleViewMode,
} from "@/modules/users/domain/constants/user-preferences.constant";

/** Public view of a user's account-level preferences (ADR-0018). */
export class UserPreferencesView {
  @ApiProperty({ enum: PEOPLE_VIEW_MODES, example: "cards" })
  peopleView: PeopleViewMode;
}
