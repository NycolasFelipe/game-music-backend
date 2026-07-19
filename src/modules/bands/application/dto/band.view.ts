import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";

/**
 * Public view of a band returned to clients (owner id is intentionally
 * omitted).
 */
export class BandView {
  id: string;
  name: string;
  theme: BandTheme;
  origin: OriginCity;
  foundationYear: FoundationYear;
  fanCount: number;
  /** Live in-game year; advances by half-year steps per turn. */
  currentYear: number;
  createdAt: Date;
  updatedAt: Date;
}
