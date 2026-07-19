import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import {
  BAND_MEMBERS_MAX,
  BAND_MEMBERS_MIN,
  BAND_THEMES,
  FOUNDATION_YEARS,
  ORIGIN_CITIES,
  type BandTheme,
  type FoundationYear,
  type OriginCity,
} from "@/modules/bands/domain/constants/band.constant";
import { CreateBandMemberSeedDto } from "@/modules/bands/presentation/http/dto/create-band-member-seed.dto";

/**
 * HTTP request body for `POST /bands`. Creates a band with its initial members.
 */
export class CreateBandDto {
  @ApiProperty({ example: "Os Rebeldes" })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ enum: BAND_THEMES, example: "grunge" })
  @IsIn([...BAND_THEMES])
  theme: BandTheme;

  @ApiProperty({ enum: ORIGIN_CITIES, example: "seattle" })
  @IsIn([...ORIGIN_CITIES])
  origin: OriginCity;

  @ApiProperty({ enum: FOUNDATION_YEARS, example: 1990 })
  @IsInt()
  @IsIn([...FOUNDATION_YEARS])
  foundationYear: FoundationYear;

  @ApiProperty({
    type: [CreateBandMemberSeedDto],
    minItems: BAND_MEMBERS_MIN,
    maxItems: BAND_MEMBERS_MAX,
  })
  @IsArray()
  @ArrayMinSize(BAND_MEMBERS_MIN)
  @ArrayMaxSize(BAND_MEMBERS_MAX)
  @ValidateNested({ each: true })
  @Type(() => CreateBandMemberSeedDto)
  members: CreateBandMemberSeedDto[];
}
