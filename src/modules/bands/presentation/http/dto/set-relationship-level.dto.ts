import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Max, Min } from "class-validator";
import {
  RELATIONSHIP_LEVEL_MAX,
  RELATIONSHIP_LEVEL_MIN,
} from "@/modules/bands/domain/constants/relationship.constant";

/**
 * HTTP request body for setting the relationship level between two members.
 */
export class SetRelationshipLevelDto {
  @ApiProperty({ format: "uuid", description: "One member id" })
  @IsUUID()
  memberId1: string;

  @ApiProperty({ format: "uuid", description: "The other member id" })
  @IsUUID()
  memberId2: string;

  @ApiProperty({
    minimum: RELATIONSHIP_LEVEL_MIN,
    maximum: RELATIONSHIP_LEVEL_MAX,
    example: 3,
  })
  @IsInt()
  @Min(RELATIONSHIP_LEVEL_MIN)
  @Max(RELATIONSHIP_LEVEL_MAX)
  level: number;
}
