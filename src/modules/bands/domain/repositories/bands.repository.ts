import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";
import type { BandEntity } from "@/modules/bands/domain/entities/band.entity";

/** DI token for the bands repository implementation. */
export const BANDS_REPOSITORY = Symbol("BANDS_REPOSITORY");

/** Data required to persist a new band. */
export interface CreateBandData {
  ownerId: string;
  name: string;
  theme: BandTheme;
  origin: OriginCity;
  foundationYear: FoundationYear;
  fanCount?: number;
}

/**
 * Persistence contract for bands. All lookups are scoped by owner so a user
 * can only ever reach their own bands.
 */
export interface BandsRepository {
  /**
   * Persists a new band.
   *
   * @param data - The band scalar data, including the owner id.
   * @returns The newly created band.
   */
  create(data: CreateBandData): Promise<BandEntity>;

  /**
   * Finds a band by id, scoped to its owner.
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns The band, or `null` when not found for this owner.
   */
  findByIdAndOwner(id: string, ownerId: string): Promise<BandEntity | null>;

  /**
   * Lists all bands belonging to an owner.
   *
   * @param ownerId - The owning user's id.
   * @returns The owner's bands.
   */
  findAllByOwner(ownerId: string): Promise<BandEntity[]>;

  /**
   * Deletes a band by id, scoped to its owner (cascades to its members).
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns `true` when a band was deleted, `false` otherwise.
   */
  deleteByIdAndOwner(id: string, ownerId: string): Promise<boolean>;
}
