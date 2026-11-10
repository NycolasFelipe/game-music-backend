import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import {
  GENDERS,
  type Gender,
} from "@/modules/band-members/domain/constants/gender.constant";
import {
  MEMBER_AGE_MAX,
  MEMBER_AGE_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";

/**
 * HTTP request body for regenerating a single member avatar.
 */
export class GenerateAvatarDto {
  @ApiProperty({ enum: GENDERS, example: "male" })
  @IsIn([...GENDERS])
  gender: Gender;

  @ApiPropertyOptional({
    minimum: MEMBER_AGE_MIN,
    maximum: MEMBER_AGE_MAX,
    example: 24,
    description: "Member age; decides whether a beard is possible (ADR-0023).",
  })
  @IsOptional()
  @IsInt()
  @Min(MEMBER_AGE_MIN)
  @Max(MEMBER_AGE_MAX)
  age?: number;
}
