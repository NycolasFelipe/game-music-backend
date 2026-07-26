import type { GigEntity } from "@/modules/gigs/domain/entities/gig.entity";

/** DI token for the gigs repository implementation. */
export const GIGS_REPOSITORY = Symbol("GIGS_REPOSITORY");

/** Data required to record a played season. */
export interface CreateGigData {
  bandId: string;
  gigTypeId: string;
  playedAtYear: number;
  fee: number;
  cost: number;
  fansGained: number;
  performance: number;
  happinessDelta: number;
}

/**
 * Persistence contract for live seasons. All lookups are scoped by band so a
 * gig can only ever be reached through a band the actor owns.
 */
export interface GigsRepository {
  /**
   * Records a played season.
   *
   * @param data - The season's outcome.
   * @returns The persisted gig.
   */
  create(data: CreateGigData): Promise<GigEntity>;

  /**
   * Lists a band's played seasons, newest first.
   *
   * @param bandId - The band id.
   * @returns The band's gig history.
   */
  findByBandId(bandId: string): Promise<GigEntity[]>;

  /**
   * Counts the seasons a band played in a given live year — the turn's slot
   * (ADR-0016 §6).
   *
   * @param bandId - The band id.
   * @param year - The band's live year (halves denote the second semester).
   * @returns The number of seasons already played that turn.
   */
  countByBandAndYear(bandId: string, year: number): Promise<number>;
}
