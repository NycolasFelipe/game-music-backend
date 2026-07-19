import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import type {
  NameGenre,
  NameLanguage,
} from "@/modules/bands/domain/generation/band-name.generator";

/**
 * HTTP request body for `POST /bands/generate-name` (name suggestions).
 */
export class GenerateBandNameDto {
  @ApiPropertyOptional({ enum: ["pt", "en", "es"], default: "pt" })
  @IsOptional()
  @IsIn(["pt", "en", "es"])
  language?: NameLanguage;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  includeArticle?: boolean;

  @ApiPropertyOptional({ enum: ["rock", "metal", "electronic", "punk"] })
  @IsOptional()
  @IsIn(["rock", "metal", "electronic", "punk"])
  genre?: NameGenre;

  @ApiPropertyOptional({ minimum: 1, maximum: 12, default: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  count?: number;
}
