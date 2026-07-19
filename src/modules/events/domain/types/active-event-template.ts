import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type { EventConsequence } from "@/modules/events/domain/types/event-consequence";

/** A template consequence: like {@link EventConsequence} but with a template. */
export type TemplateConsequence = Omit<EventConsequence, "description"> & {
  /** Description template with placeholders (e.g. `{character1}`). */
  descriptionTemplate: string;
};

/** A template consequence with an explicit weight (for probabilistic rolls). */
export type TemplateWeightedConsequence = TemplateConsequence & {
  chance: number;
};

/** A template option consequence: a single outcome or a weighted list. */
export type TemplateConsequenceOrWeighted =
  TemplateConsequence | TemplateWeightedConsequence[];

/** An option within an active event template. */
export interface ActiveEventTemplateOption {
  label: string;
  description: string;
  /** Show the option if any involved character has one of these traits. */
  visibleIfAnyInvolvedHas?: string[];
  /** Show the option if any involved character has all of these traits. */
  visibleIfAnyInvolvedHasAll?: string[];
  /** Per-position (OR) trait requirements to show the option. */
  visibleIfCharacterHas?: string[][];
  /** Per-position (AND) trait requirements to show the option. */
  visibleIfCharacterHasAll?: string[][];
  consequence: TemplateConsequenceOrWeighted;
}

/**
 * A static active-event template. Instantiated into an {@link ActiveEventEntity}
 * for a specific band state (year, members, relationships, fan count).
 */
export interface ActiveEventTemplate {
  id: string;
  type: ActiveEventType;
  title: string;
  descriptionTemplate: string;
  minYear?: number;
  maxYear?: number;
  minFanCount?: number;
  maxFanCount?: number;
  /** OR: the band must have at least one character with one of these traits. */
  requiredBandCharacteristics?: string[];
  /** AND: the band must cover each of these traits (across members). */
  requiredBandCharacteristicsAll?: string[];
  /** OR requirement on the involved characters. */
  requiredInvolvedCharacteristics?: string[];
  /** AND requirement on the involved characters (as a set). */
  requiredInvolvedCharacteristicsAll?: string[];
  /** Per-position (OR) requirements: index 0 => character1, etc. */
  requiredCharacterCharacteristics?: string[][];
  /** Per-position (AND) requirements: index 0 => character1, etc. */
  requiredCharacterCharacteristicsAll?: string[][];
  minRelationshipLevel?: number;
  maxRelationshipLevel?: number;
  /** Number of characters required (1 for solo, 2+ for pairs/conflicts). */
  requiredCharacters: number;
  options: ActiveEventTemplateOption[];
}
