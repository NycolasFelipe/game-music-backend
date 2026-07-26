import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { GIG_TYPE_IDS } from "@/modules/gigs/domain/data/gig-types";

/** HTTP request body for playing a live season (ADR-0016). */
export class PlayGigDto {
  @ApiProperty({ enum: GIG_TYPE_IDS, example: "bar" })
  @IsIn(GIG_TYPE_IDS as readonly string[])
  gigTypeId: string;
}
