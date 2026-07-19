/**
 * A change to the relationship between two members, referenced by member id.
 */
export interface RelationshipChange {
  character1Id: string;
  character2Id: string;
  /** Delta applied to the relationship level (usually -5..5). */
  change: number;
}

/**
 * The effect of choosing an option in an active event, with a rendered
 * description. All numeric fields are optional; the engine derives defaults.
 */
export interface EventConsequence {
  /** Short result label (e.g. "Neutro", "Confronto"). */
  resultLabel?: string;
  /** Fan change as a percentage of the current fan count (e.g. +10 => +10%). */
  fanCountChange?: number;
  /** Absolute fan change (integer), applied directly. */
  fanCountChangeAbsolute?: number;
  /** Happiness change as a percentage of the happiness scale (5). */
  happinessChangePercent?: number;
  /** Relationship changes between members. */
  relationshipChanges?: RelationshipChange[];
  /** Money change (future). */
  moneyChange?: number;
  /** Rendered result description. */
  description: string;
}

/** A consequence with an explicit weight, for probabilistic outcomes. */
export interface WeightedEventConsequence extends EventConsequence {
  /** Relative weight/percent (need not sum to 100). */
  chance: number;
}

/** An option's consequence: a single outcome or a weighted list. */
export type EventOptionConsequence =
  EventConsequence | WeightedEventConsequence[];

/**
 * An option presented to the player, with its (already text-resolved)
 * consequence. Weighted consequences are rolled at resolution time.
 */
export interface ResolvedEventOption {
  id: string;
  label: string;
  description: string;
  consequence: EventOptionConsequence;
}
