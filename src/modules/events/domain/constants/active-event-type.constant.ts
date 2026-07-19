/**
 * Categories of active events. The empty string is a generic/wildcard type
 * (eligible for any selected category during generation).
 */
export const ACTIVE_EVENT_TYPES = [
  "",
  "conflito_membros",
  "oportunidade_externa",
  "decisao_criativa",
  "crise_financeira",
  "proposta_contrato",
] as const;

/** An active event type identifier. */
export type ActiveEventType = (typeof ACTIVE_EVENT_TYPES)[number];
