import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";
import {
  SKILL_MAX,
  SKILL_MIN,
} from "@/modules/band-members/domain/constants/skill.constant";

/**
 * The six musical skills of a band member. Each value is an integer 0..10.
 */
export class SkillsDto {
  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 3 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  vocal: number;

  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 2 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  guitar: number;

  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 1 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  bass: number;

  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 0 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  drums: number;

  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 1 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  piano: number;

  @ApiProperty({ minimum: SKILL_MIN, maximum: SKILL_MAX, example: 2 })
  @IsInt()
  @Min(SKILL_MIN)
  @Max(SKILL_MAX)
  lyrics: number;
}
