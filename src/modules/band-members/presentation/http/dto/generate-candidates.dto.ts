import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import {
  CANDIDATES_DEFAULT,
  CANDIDATES_MAX,
  CANDIDATES_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";

/**
 * HTTP request body for generating member candidates.
 */
export class GenerateCandidatesDto {
  @ApiPropertyOptional({
    minimum: CANDIDATES_MIN,
    maximum: CANDIDATES_MAX,
    default: CANDIDATES_DEFAULT,
  })
  @IsOptional()
  @IsInt()
  @Min(CANDIDATES_MIN)
  @Max(CANDIDATES_MAX)
  count?: number;
}
