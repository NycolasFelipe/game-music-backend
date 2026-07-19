import type { PassiveEventType } from "@/modules/events/domain/constants/passive-event-type.constant";

/**
 * A static passive-event template. `template` carries placeholders such as
 * `{artista}`, `{artista1}`, `{artista2}`, `{banda}`, `{anos}`, `{nome_single}`,
 * `{nome_album}`, `{nome_turne}`, `{motivo}` and `{avaliacao}`.
 */
export interface PassiveEventTemplate {
  /** Stable id (added on the backend for anti-repeat tracking). */
  id: string;
  template: string;
  type: PassiveEventType;
  /** Number of artists required to fill the template (1 or 2). */
  requiredArtists: number;
  /** Compatibility tags used to filter eligible artists. */
  compatibilidade: string[];
}
