import type { CreateBandMemberData } from "@/modules/band-members/domain/repositories/band-members.repository";
import type {
  BandTheme,
  FoundationYear,
  OriginCity,
} from "@/modules/bands/domain/constants/band.constant";
import type { BandWithMembers } from "@/modules/bands/domain/entities/band-with-members";
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

/** A member to create alongside a band (band id assigned during the insert). */
export type CreateBandMemberSeed = Omit<CreateBandMemberData, "bandId">;

/** Absolute band-aggregate values to apply atomically (e.g. after an event). */
export interface BandStateChangesInput {
  /** New absolute fan count. */
  fanCount?: number;
  /** New absolute happiness per member. */
  memberHappiness?: Array<{ memberId: string; happiness: number }>;
  /** New absolute level per canonical member pair (upserted). */
  relationshipLevels?: Array<{
    memberAId: string;
    memberBId: string;
    level: number;
  }>;
}

/**
 * Persistence contract for bands. All lookups are scoped by owner so a user
 * can only ever reach their own bands.
 */
export interface BandsRepository {
  /**
   * Persists a new band together with its members, atomically.
   *
   * @param data - The band scalar data, including the owner id.
   * @param members - The members to create for the band.
   * @returns The created band composed with its persisted members.
   */
  createWithMembers(
    data: CreateBandData,
    members: CreateBandMemberSeed[],
  ): Promise<BandWithMembers>;

  /**
   * Finds a band by id, scoped to its owner (scalars only).
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns The band, or `null` when not found for this owner.
   */
  findByIdAndOwner(id: string, ownerId: string): Promise<BandEntity | null>;

  /**
   * Finds a band by id (scoped to its owner) composed with its members.
   *
   * @param id - The band id.
   * @param ownerId - The owning user's id.
   * @returns The band with members, or `null` when not found for this owner.
   */
  findByIdAndOwnerWithMembers(
    id: string,
    ownerId: string,
  ): Promise<BandWithMembers | null>;

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

  /**
   * Applies absolute band-aggregate changes (fan count, member happiness,
   * relationship levels) atomically. Used to persist event consequences.
   *
   * @param bandId - The band id.
   * @param changes - The absolute values to apply.
   * @returns A promise that resolves once applied.
   */
  applyBandStateChanges(
    bandId: string,
    changes: BandStateChangesInput,
  ): Promise<void>;
}
