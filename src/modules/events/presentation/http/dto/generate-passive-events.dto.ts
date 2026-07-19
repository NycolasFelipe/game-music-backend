import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

/**
 * HTTP request body for generating passive events for a year.
 */
export class GeneratePassiveEventsDto {
  @ApiProperty({ example: 2003, minimum: 1900, maximum: 3000 })
  @IsNumber()
  @Min(1900)
  @Max(3000)
  year: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 10, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  count?: number;
}
