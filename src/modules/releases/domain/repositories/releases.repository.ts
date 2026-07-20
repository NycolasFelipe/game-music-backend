import type {
  ReleaseCreationLogEntry,
  ReleaseCredits,
  ReleaseDetails,
} from "@/modules/releases/domain/constants/release.constant";
import type { CreationEventEntity } from "@/modules/releases/domain/entities/creation-event.entity";
import type { ReleaseEntity } from "@/modules/releases/domain/entities/release.entity";
import type { GeneratedCreationEvent } from "@/modules/releases/domain/types/creation-event";

/** DI token for the releases repository implementation. */
export const RELEASES_REPOSITORY = Symbol("RELEASES_REPOSITORY");

/** The resolution applied to a creation event. */
export interface ResolveCreationEventData {
  chosenOptionId: string;
  qualityModifier: number;
}

/** New absolute royalty-tail values after a turn's payout. */
export interface RoyaltyPayoutData {
  royaltyRemaining: number;
  royaltyTurnsLeft: number;
}

/** Data required to persist a new release draft. */
export interface CreateReleaseData {
  bandId: string;
  title: string;
  concept: string;
  format: string;
  style: string;
  budgetTier: string;
  credits: ReleaseCredits;
}

/** Absolute outcome fields written when a draft is finalized (launched). */
export interface FinalizeReleaseData {
  quality: number;
  qualityTier: string;
  fansGained: number;
  cost: number;
  masterRevenueTotal: number;
  publishingRevenueTotal: number;
  royaltyRemaining: number;
  royaltyTurnsLeft: number;
  releasedAtYear: number;
  creationLog: ReleaseCreationLogEntry[];
  details: ReleaseDetails;
}

/**
 * Persistence contract for releases. All lookups are scoped by band so a release
 * can only ever be reached through a band the actor owns.
 */
export interface ReleasesRepository {
  /**
   * Persists a new release draft (`em_criacao`).
   *
   * @param data - The draft's authorship data.
   * @returns The created release.
   */
  create(data: CreateReleaseData): Promise<ReleaseEntity>;

  /**
   * Finds a release by id, scoped to its band.
   *
   * @param id - The release id.
   * @param bandId - The owning band id.
   * @returns The release, or `null` when not found for this band.
   */
  findByIdAndBand(id: string, bandId: string): Promise<ReleaseEntity | null>;

  /**
   * Lists a band's releases (discography), newest first.
   *
   * @param bandId - The band id.
   * @returns The band's releases.
   */
  findByBandId(bandId: string): Promise<ReleaseEntity[]>;

  /**
   * Applies the outcome of finalization and flips the status to `lancada`.
   *
   * @param id - The release id.
   * @param data - The computed outcome fields.
   * @returns The finalized release.
   */
  finalize(id: string, data: FinalizeReleaseData): Promise<ReleaseEntity>;

  /**
   * Deletes a release by id, scoped to its band.
   *
   * @param id - The release id.
   * @param bandId - The owning band id.
   * @returns `true` when a release was deleted, `false` otherwise.
   */
  deleteByIdAndBand(id: string, bandId: string): Promise<boolean>;

  /**
   * Counts a band's releases still in creation (drafts).
   *
   * @param bandId - The band id.
   * @returns The number of in-creation releases.
   */
  countInCreation(bandId: string): Promise<number>;

  /**
   * Persists the generated creation events for a release draft.
   *
   * @param releaseId - The release the events belong to.
   * @param events - The generated events to persist.
   * @returns The persisted creation events.
   */
  createCreationEvents(
    releaseId: string,
    events: GeneratedCreationEvent[],
  ): Promise<CreationEventEntity[]>;

  /**
   * Lists a release's creation events, ordered by sequence.
   *
   * @param releaseId - The release id.
   * @returns The creation events.
   */
  findCreationEventsByRelease(
    releaseId: string,
  ): Promise<CreationEventEntity[]>;

  /**
   * Finds a single creation event scoped to its release.
   *
   * @param id - The creation-event id.
   * @param releaseId - The owning release id.
   * @returns The creation event, or `null` when not found.
   */
  findCreationEvent(
    id: string,
    releaseId: string,
  ): Promise<CreationEventEntity | null>;

  /**
   * Records the resolution of a creation event.
   *
   * @param id - The creation-event id.
   * @param data - The chosen option and the quality modifier it produced.
   * @returns The resolved creation event.
   */
  resolveCreationEvent(
    id: string,
    data: ResolveCreationEventData,
  ): Promise<CreationEventEntity>;

  /**
   * Counts a release's unresolved creation events.
   *
   * @param releaseId - The release id.
   * @returns The number of pending creation events.
   */
  countPendingCreationEvents(releaseId: string): Promise<number>;

  /**
   * Lists a band's launched releases that still have a royalty tail to pay.
   *
   * @param bandId - The band id.
   * @returns The releases with `royaltyTurnsLeft > 0` and a positive remainder.
   */
  findActiveRoyaltyReleases(bandId: string): Promise<ReleaseEntity[]>;

  /**
   * Applies a turn's royalty payout to a release (new absolute tail values).
   *
   * @param id - The release id.
   * @param data - The new remaining tail and turns-left.
   * @returns A promise that resolves once applied.
   */
  applyRoyaltyPayout(id: string, data: RoyaltyPayoutData): Promise<void>;
}
