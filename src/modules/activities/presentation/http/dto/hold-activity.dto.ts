import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsIn, IsUUID } from "class-validator";
import { ACTIVITY_IDS } from "@/modules/activities/domain/data/activities";

/** HTTP request body for holding an activity (ADR-0017). */
export class HoldActivityDto {
  @ApiProperty({ enum: ACTIVITY_IDS, example: "festa" })
  @IsIn(ACTIVITY_IDS as readonly string[])
  activityId: string;

  @ApiProperty({
    description:
      "Ids of the members going. Size bounds come from the activity.",
    type: [String],
    format: "uuid",
  })
  @ArrayMinSize(2)
  @ArrayUnique()
  @IsUUID("4", { each: true })
  participantIds: string[];
}
