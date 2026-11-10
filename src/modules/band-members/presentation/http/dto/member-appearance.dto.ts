import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn } from "class-validator";
import {
  BEARDS,
  GLASSES,
  HAIR_STYLES,
  SHIRTS,
  SHIRT_TONES,
  type Beard,
  type Glasses,
  type HairStyle,
  type Shirt,
  type ShirtTone,
} from "@/modules/band-members/domain/constants/appearance.constant";

/** A member's look as sent by the client (ADR-0023), validated against the catalogs. */
export class MemberAppearanceDto {
  @ApiProperty({ enum: HAIR_STYLES, example: "long" })
  @IsIn([...HAIR_STYLES])
  hairStyle: HairStyle;

  @ApiProperty({ enum: BEARDS, example: "none" })
  @IsIn([...BEARDS])
  beard: Beard;

  @ApiProperty({ enum: GLASSES, example: "round" })
  @IsIn([...GLASSES])
  glasses: Glasses;

  @ApiProperty({ example: true })
  @IsBoolean()
  earring: boolean;

  @ApiProperty({ enum: SHIRTS, example: "crew" })
  @IsIn([...SHIRTS])
  shirt: Shirt;

  @ApiProperty({ enum: SHIRT_TONES, example: 8 })
  @IsIn([...SHIRT_TONES])
  shirtTone: ShirtTone;
}
