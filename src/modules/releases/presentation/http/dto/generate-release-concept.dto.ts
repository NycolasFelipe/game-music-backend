import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import {
  BAND_THEMES,
  type BandTheme,
} from "@/modules/bands/domain/constants/band.constant";

/**
 * HTTP request body for `POST /releases/generate-concept`.
 */
export class GenerateReleaseConceptDto {
  @ApiPropertyOptional({
    description: "The work's title, woven into the text.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    enum: BAND_THEMES,
    description: "Style whose label is woven into the text.",
  })
  @IsOptional()
  @IsIn([...BAND_THEMES])
  style?: BandTheme;
}
