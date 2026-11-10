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

/** A happiness change for one member (relative, applied on resolution). */
export interface CreationEventHappinessCost {
  memberId: string;
  delta: number;
}

/** A relationship change for one member pair (relative, applied on resolution). */
export interface CreationEventRelationshipCost {
  memberAId: string;
  memberBId: string;
  delta: number;
}

/**
 * What an option costs beyond its quality effect (ADR-0019): the price its text
 * promises — more studio time, a member who was overruled, a rift between the
 * two who fought over the record. Absent means the option is free.
 */
export interface CreationEventCost {
  /** Production turns added to the work. */
  extraProductionTurns?: number;
  /** Happiness changes per member. */
  happiness?: CreationEventHappinessCost[];
  /** Relationship changes per member pair. */
  relationships?: CreationEventRelationshipCost[];
}

/** A single choice within a creation event. */
export interface CreationEventOption {
  id: string;
  label: string;
  description: string;
  effect: CreationEventEffect;
  /** Side cost of choosing this option (ADR-0019). */
  cost?: CreationEventCost;
}

/** A generated creation event (before it is assigned an id / persisted). */
export interface GeneratedCreationEvent {
  sequence: number;
  kind: CreationEventKind;
  prompt: string;
  options: CreationEventOption[];
}
