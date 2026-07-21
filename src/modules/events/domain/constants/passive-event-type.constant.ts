/**
 * Categories of **generated** passive (timeline/narrative) events involving
 * world artists. These have selection probabilities and are produced by the
 * passive-event generator.
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

/** A generated (world-artist) passive event type identifier. */
export type GeneratedPassiveEventType = (typeof PASSIVE_EVENT_TYPES)[number];

/**
 * Band-internal timeline events, recorded directly (not world-generated) — e.g.
 * a member leaving the band. They live on the same timeline but carry no
 * selection probability (the generator never picks them).
 */
export const INTERNAL_PASSIVE_EVENT_TYPES = ["saida_integrante"] as const;

/** A band-internal passive event type identifier. */
export type InternalPassiveEventType =
  (typeof INTERNAL_PASSIVE_EVENT_TYPES)[number];

/** Any passive event type: generated (world) or band-internal. */
export type PassiveEventType =
  GeneratedPassiveEventType | InternalPassiveEventType;

/**
 * Selection weights per **generated** event type (sum to 100). Iteration order
 * matters for the cumulative-probability pick, so keep it stable.
 */
export const PASSIVE_EVENT_PROBABILITIES: Record<
  GeneratedPassiveEventType,
  number
> = {
  colaboracao_musical: 30,
  evento_social: 20,
  turne_conjunta: 15,
  cancelamento_show: 10,
  lancamento_album: 15,
  polemica: 5,
  aposentadoria: 3,
  retorno_hiato: 2,
};
