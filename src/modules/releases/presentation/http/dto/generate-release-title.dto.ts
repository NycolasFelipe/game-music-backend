import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import type { TitleLanguage } from "@/modules/releases/domain/generation/release-title.generator";

/**
 * HTTP request body for `POST /releases/generate-title` (title suggestions).
 */
export class GenerateReleaseTitleDto {
  @ApiPropertyOptional({ enum: ["pt", "en", "es"], default: "pt" })
  @IsOptional()
  @IsIn(["pt", "en", "es"])
  language?: TitleLanguage;

  @ApiPropertyOptional({ minimum: 1, maximum: 12, default: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  count?: number;
}
