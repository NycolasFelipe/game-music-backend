import type { BandActivityEntity } from "@/modules/activities/domain/entities/band-activity.entity";

/** DI token for the band-activities repository implementation. */
export const BAND_ACTIVITIES_REPOSITORY = Symbol("BAND_ACTIVITIES_REPOSITORY");

/** Data required to record a held activity. */
export interface CreateBandActivityData {
  bandId: string;
  activityId: string;
  heldAtYear: number;
  cost: number;
  participantIds: string[];
  happinessDelta: number;
  relationshipDelta: number;
  trouble: boolean;
  troubleEventId: string | null;
  story: string[];
}

/**
 * Persistence contract for band activities. All lookups are scoped by band so
 * an activity can only ever be reached through a band the actor owns.
 */
export interface BandActivitiesRepository {
  /**
   * Records a held activity.
   *
   * @param data - The activity's outcome.
   * @returns The persisted activity.
   */
  create(data: CreateBandActivityData): Promise<BandActivityEntity>;

  /**
   * Lists a band's activities, newest first.
   *
   * @param bandId - The band id.
   * @returns The band's activity history.
   */
  findByBandId(bandId: string): Promise<BandActivityEntity[]>;

  /**
   * Counts the activities a band held in a given live year — the input to the
   * diminishing returns of ADR-0017 §2.
   *
   * @param bandId - The band id.
   * @param year - The band's live year (halves denote the second semester).
   * @returns The number of activities already held that turn.
   */
  countByBandAndYear(bandId: string, year: number): Promise<number>;
}
