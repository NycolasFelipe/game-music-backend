import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";

/**
 * Domain representation of a band (the aggregate root the player manages).
 *
 * Members are intentionally NOT embedded here: they are a separate aggregate
 * owned by the `band-members` module and composed at the application layer.
 * This keeps the domain free of cross-module cycles.
 */
export class BandEntity {
  constructor(
    public readonly id: string,
    /** Id of the user who owns this band. */
    public readonly ownerId: string,
    public readonly name: string,
    public readonly theme: BandTheme,
    public readonly origin: OriginCity,
    public readonly foundationYear: FoundationYear,
    /** Number of fans (treated as "fame" in parts of the game). */
    public readonly fanCount: number,
    /**
     * Live in-game year (the save's "clock"). Starts at {@link foundationYear}
     * and advances by half-year steps as turns are taken. Fractional (`.5`)
     * values denote the second semester of a calendar year.
     */
    public readonly currentYear: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
