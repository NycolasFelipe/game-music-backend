import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";
import type { CreateBandMemberInput } from "@/modules/bands/application/dto/create-band-member.input";

/**
 * Application input for creating a band with its initial members. Plain class
 * with no transport/validation decorators — the controller maps the validated
 * HTTP DTO into this shape.
 */
export class CreateBandInput {
  name: string;
  theme: BandTheme;
  origin: OriginCity;
  foundationYear: FoundationYear;
  members: CreateBandMemberInput[];
}
