import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";

/**
 * HTTP request body for generating an active event. The `year` drives event
 * eligibility (the turn system is not implemented; the client supplies it).
 */
export class GenerateActiveEventDto {
  @ApiProperty({ example: 2003, minimum: 1900, maximum: 3000 })
  @IsNumber()
  @Min(1900)
  @Max(3000)
  year: number;
}
