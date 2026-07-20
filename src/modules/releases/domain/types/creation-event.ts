/**
 * Types for creation events — the interactive decisions that shape a work while
 * it is being made (ADR-0008 §6). Effects are resolved server-side; the client
 * never sees the odds (they are stripped from the view).
 */

/** Kinds of creation event. */
export const CREATION_EVENT_KINDS = [
  "conflito_visao",
  "ideia_maluca",
  "perfeccionismo",
  "preguica",
] as const;

/** A creation-event kind. */
export type CreationEventKind = (typeof CREATION_EVENT_KINDS)[number];

/** Maximum number of creation events generated for a single work. */
export const MAX_CREATION_EVENTS = 3;

/** A deterministic option effect: a fixed quality modifier. */
export interface CreationEventFixedEffect {
  type: "fixed";
  qualityModifier: number;
}

/** A gamble: on success/failure, one of two modifiers applies. */
export interface CreationEventProbabilisticEffect {
  type: "probabilistic";
  successChance: number;
  successModifier: number;
  failureModifier: number;
}

/** How an option affects the work's quality when chosen. */
export type CreationEventEffect =
  CreationEventFixedEffect | CreationEventProbabilisticEffect;

/** A single choice within a creation event. */
export interface CreationEventOption {
  id: string;
  label: string;
  description: string;
  effect: CreationEventEffect;
}

/** A generated creation event (before it is assigned an id / persisted). */
export interface GeneratedCreationEvent {
  sequence: number;
  kind: CreationEventKind;
  prompt: string;
  options: CreationEventOption[];
}
