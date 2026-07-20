import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  BAND_THEMES,
  type BandTheme,
} from "@/modules/bands/domain/constants/band.constant";
import {
  BUDGET_TIER_IDS,
  type BudgetTierId,
} from "@/modules/releases/domain/data/budget-tiers";
import {
  RELEASE_FORMAT_IDS,
  type ReleaseFormatId,
} from "@/modules/releases/domain/data/release-formats";

/** Aspect → member ids. Each aspect is optional; ids must be band members. */
export class ReleaseCreditsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  vocal?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  guitar?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  bass?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  drums?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  piano?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  lyrics?: string[];
}

/**
 * HTTP request body for `POST /bands/:bandId/releases` (start a draft).
 */
export class StartReleaseDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  concept?: string;

  @ApiProperty({ enum: BAND_THEMES })
  @IsIn([...BAND_THEMES])
  style: BandTheme;

  @ApiProperty({ enum: RELEASE_FORMAT_IDS })
  @IsIn([...RELEASE_FORMAT_IDS])
  format: ReleaseFormatId;

  @ApiProperty({ enum: BUDGET_TIER_IDS })
  @IsIn([...BUDGET_TIER_IDS])
  budgetTier: BudgetTierId;

  @ApiProperty({ type: ReleaseCreditsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ReleaseCreditsDto)
  credits: ReleaseCreditsDto;
}
