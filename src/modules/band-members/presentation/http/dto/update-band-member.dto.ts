import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";
import {
  MEMBER_AGE_MAX,
  MEMBER_AGE_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";

/**
 * HTTP request body for updating a member. Only name, age and biography are
 * editable (skills, characteristics and gender are fixed at generation).
 */
export class UpdateBandMemberDto {
  @ApiPropertyOptional({ example: "João Silva Santos" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ minimum: MEMBER_AGE_MIN, maximum: MEMBER_AGE_MAX })
  @IsOptional()
  @IsInt()
  @Min(MEMBER_AGE_MIN)
  @Max(MEMBER_AGE_MAX)
  age?: number;

  @ApiPropertyOptional({ example: "Nova biografia..." })
  @IsOptional()
  @IsString()
  @MinLength(1)
  biography?: string;
}
