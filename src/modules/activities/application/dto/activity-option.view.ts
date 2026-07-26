import type { ActivityId } from "@/modules/activities/domain/data/activities";

/** An activity priced for a specific band, ready to be offered to the player. */
export class ActivityOptionView {
  id: ActivityId;
  label: string;
  description: string;
  emoji: string;
  minParticipants: number;
  maxParticipants: number;
  /** Happiness each participant gains at full effect. */
  happinessGain: number;
  /** Relationship levels each participating pair gains at full effect. */
  relationshipGain: number;
  /** Base chance (`0..1`) of going wrong, before the guest list's hostility. */
  troubleChance: number;
  /**
   * What it costs for each allowed guest-list size, already including the
   * band's fame multiplier — so the client never re-implements the formula.
   */
  costs: Array<{ participants: number; cost: number }>;
}

/** The activities on offer plus what this turn already did to their effect. */
export class ActivityOptionsView {
  /** How many activities the band already held this turn. */
  heldThisTurn: number;
  /** Effect multiplier the next activity would get (ADR-0017 §2). */
  nextSaturation: number;
  /**
   * How much each point of hostility on the guest list adds to the risk. Sent
   * so the client can warn about a volatile guest list without hardcoding the
   * rule — the guest list is only known there (ADR-0017 §3).
   */
  hostilityRisk: number;
  /** Ceiling the composed risk never crosses. */
  troubleChanceMax: number;
  activities: ActivityOptionView[];
}
