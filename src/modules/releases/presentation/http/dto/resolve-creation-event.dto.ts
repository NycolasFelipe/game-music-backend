import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

/**
 * HTTP request body for resolving a creation event (the chosen option).
 */
export class ResolveCreationEventDto {
  @ApiProperty({ description: "The id of the chosen option." })
  @IsString()
  @MaxLength(64)
  optionId: string;
}
