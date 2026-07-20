import type { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";

/** DI token for the turns repository implementation. */
export const TURNS_REPOSITORY = Symbol("TURNS_REPOSITORY");

/** Data required to persist a recorded turn. */
export interface CreateTurnData {
  bandId: string;
  year: number;
  fanCountSnapshot: number;
  balanceSnapshot: number | null;
  happinessAvgSnapshot: number | null;
  relationshipAvgSnapshot: number | null;
  passiveEventId: string | null;
  activeEventId: string | null;
}

/**
 * Persistence contract for recorded turns (the per-band turn history/timeline).
 */
export interface TurnsRepository {
  /**
   * Persists a recorded turn.
   *
   * @param data - The turn snapshot to store.
   * @returns The created turn.
   */
  create(data: CreateTurnData): Promise<TurnEntity>;

  /**
   * Lists a band's turns in chronological order (oldest first).
   *
   * @param bandId - The band id.
   * @returns The band's recorded turns.
   */
  findByBandId(bandId: string): Promise<TurnEntity[]>;
}
