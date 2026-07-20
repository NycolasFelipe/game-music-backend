import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import {
  GENDERS,
  type Gender,
} from "@/modules/band-members/domain/constants/gender.constant";

/**
 * HTTP request body for regenerating a single member avatar.
 */
export class GenerateAvatarDto {
  @ApiProperty({ enum: GENDERS, example: "male" })
  @IsIn([...GENDERS])
  gender: Gender;
}
