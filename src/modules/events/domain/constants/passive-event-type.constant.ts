/**
 * Categories of passive (timeline/narrative) events involving world artists.
 */
export const PASSIVE_EVENT_TYPES = [
  "colaboracao_musical",
  "evento_social",
  "turne_conjunta",
  "cancelamento_show",
  "lancamento_album",
  "polemica",
  "aposentadoria",
  "retorno_hiato",
] as const;

/** A passive event type identifier. */
export type PassiveEventType = (typeof PASSIVE_EVENT_TYPES)[number];

/**
 * Selection weights per event type (sum to 100). Iteration order matters for
 * the cumulative-probability pick, so keep it stable.
 */
export const PASSIVE_EVENT_PROBABILITIES: Record<PassiveEventType, number> = {
  colaboracao_musical: 30,
  evento_social: 20,
  turne_conjunta: 15,
  cancelamento_show: 10,
  lancamento_album: 15,
  polemica: 5,
  aposentadoria: 3,
  retorno_hiato: 2,
};
