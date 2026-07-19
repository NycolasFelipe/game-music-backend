import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import {
  GENDERS,
  type Gender,
} from "@/modules/band-members/domain/constants/gender.constant";
import {
  CHARACTERISTICS_MAX,
  CHARACTERISTICS_MIN,
  HAPPINESS_MAX,
  HAPPINESS_MIN,
  MEMBER_AGE_MAX,
  MEMBER_AGE_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  SKILL_TYPES,
  type SkillType,
} from "@/modules/band-members/domain/constants/skill.constant";
import { SkillsDto } from "@/modules/bands/presentation/http/dto/skills.dto";

/**
 * A member to create together with a band. The client sends the (generated)
 * member; the server revalidates ranges/enums before persisting.
 */
export class CreateBandMemberSeedDto {
  @ApiProperty({ example: "João Silva Santos" })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    minimum: MEMBER_AGE_MIN,
    maximum: MEMBER_AGE_MAX,
    example: 24,
  })
  @IsInt()
  @Min(MEMBER_AGE_MIN)
  @Max(MEMBER_AGE_MAX)
  age: number;

  @ApiProperty({ enum: GENDERS, example: "male" })
  @IsIn([...GENDERS])
  gender: Gender;

  @ApiProperty({ minimum: HAPPINESS_MIN, maximum: HAPPINESS_MAX, example: 1 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(HAPPINESS_MIN)
  @Max(HAPPINESS_MAX)
  happiness: number;

  @ApiProperty({
    type: [String],
    example: ["creative", "professional"],
    minItems: CHARACTERISTICS_MIN,
    maxItems: CHARACTERISTICS_MAX,
  })
  @IsArray()
  @ArrayMinSize(CHARACTERISTICS_MIN)
  @ArrayMaxSize(CHARACTERISTICS_MAX)
  @IsString({ each: true })
  characteristics: string[];

  @ApiProperty({ type: SkillsDto })
  @ValidateNested()
  @Type(() => SkillsDto)
  skills: SkillsDto;

  @ApiProperty({
    example: "Ex-advogado que trocou as petições pelos pedais...",
  })
  @IsString()
  @MinLength(1)
  biography: string;

  @ApiProperty({ enum: SKILL_TYPES, example: "guitar" })
  @IsIn([...SKILL_TYPES])
  primarySkill: SkillType;

  @ApiPropertyOptional({ example: 1990 })
  @IsOptional()
  @IsInt()
  joinYear?: number;
}
