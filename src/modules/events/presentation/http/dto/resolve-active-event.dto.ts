import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

/**
 * HTTP request body for resolving an active event.
 */
export class ResolveActiveEventDto {
  @ApiProperty({ example: "option_0", description: "Id of the chosen option" })
  @IsString()
  @MinLength(1)
  optionId: string;
}
