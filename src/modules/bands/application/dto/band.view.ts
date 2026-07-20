import { FameView } from "@/modules/bands/application/dto/fame.view";
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
  /** Fame standing derived from {@link fanCount}. */
  fame: FameView;
  /** Live in-game year; advances by half-year steps per turn. */
  currentYear: number;
  /** The band's cash balance (money). */
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}
