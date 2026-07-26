import {
  ACTIVITY_FAME_COST_STEP,
  ACTIVITY_HOSTILITY_RISK,
  ACTIVITY_SATURATION_FACTORS,
  ACTIVITY_TROUBLE_CHANCE_MAX,
} from "@/modules/activities/domain/constants/activity.constant";
import type { Activity } from "@/modules/activities/domain/data/activities";
import {
  HAPPINESS_MAX,
  HAPPINESS_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  RELATIONSHIP_LEVEL_MAX,
  RELATIONSHIP_LEVEL_MIN,
} from "@/modules/bands/domain/constants/relationship.constant";

/**
 * Activity scoring (ADR-0017) — pure functions. What an activity costs, who it
 * touches and how likely it is to go wrong; the roll itself belongs to the
 * caller, as in the gig and release calculators.
 */

/** A participant as consumed by the activity calculator. */
export interface ActivityParticipant {
  id: string;
  happiness: number;
}

/** An existing relationship between two members of the band. */
export interface ActivityRelationship {
  memberAId: string;
  memberBId: string;
  level: number;
}

/** Everything needed to evaluate an activity. */
export interface ActivityEvaluationInput {
  activity: Activity;
  /** Only the members on the guest list. */
  participants: ActivityParticipant[];
  /** Every relationship in the band (pairs outside the list are ignored). */
  relationships: ActivityRelationship[];
  /** The band's fame level, which makes tastes expensive. */
  fameLevel: number;
  /** How many activities the band already held this turn. */
  heldThisTurn: number;
}

/** The computed outcome of an activity. */
export interface ActivityEvaluation {
  cost: number;
  /** Effect multiplier applied, `0..1` (ADR-0017 §2). */
  saturation: number;
  /** Happiness each participant gained (already saturated). */
  happinessDelta: number;
  /** Relationship levels each participating pair gained (already saturated). */
  relationshipDelta: number;
  /** New absolute happiness per participant, clamped. */
  memberHappiness: Array<{ memberId: string; happiness: number }>;
  /** New absolute level per participating pair, clamped. */
  relationshipLevels: Array<{
    memberAId: string;
    memberBId: string;
    level: number;
  }>;
  /** The most hostile pair on the guest list — the one that may blow up. */
  weakestPair: { memberAId: string; memberBId: string; level: number } | null;
  /** Chance (`0..1`) that the activity goes wrong. */
  troubleChance: number;
}

/** Clamps a value to `[min, max]`. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds to two decimals (happiness precision). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * What an activity costs for a given guest list (ADR-0017 §1).
 *
 * @param activity - The activity.
 * @param participantCount - How many people are going.
 * @param fameLevel - The band's fame level.
 * @returns The cost, rounded to two decimals.
 */
export function activityCost(
  activity: Activity,
  participantCount: number,
  fameLevel: number,
): number {
  const base =
    activity.baseCost + activity.costPerParticipant * participantCount;
  return round2(base * (1 + Math.max(0, fameLevel) * ACTIVITY_FAME_COST_STEP));
}

/**
 * The effect multiplier for the n-th activity of the turn.
 *
 * @param heldThisTurn - How many activities were already held this turn.
 * @returns A factor in `[0, 1]`.
 */
export function saturationFactor(heldThisTurn: number): number {
  const index = Math.max(0, Math.floor(heldThisTurn));
  return (
    ACTIVITY_SATURATION_FACTORS[index] ??
    ACTIVITY_SATURATION_FACTORS[ACTIVITY_SATURATION_FACTORS.length - 1]
  );
}

/**
 * How likely the activity is to go wrong: its own base risk plus the hostility
 * the player chose to put in the same room (ADR-0017 §3).
 *
 * @param activity - The activity.
 * @param worstLevel - The lowest relationship level among the guests (`null`
 * when no pair among them has a relationship).
 * @returns The chance in `[0, ACTIVITY_TROUBLE_CHANCE_MAX]`.
 */
export function troubleChance(
  activity: Activity,
  worstLevel: number | null,
): number {
  const hostility = worstLevel === null ? 0 : Math.max(0, -worstLevel);
  return round2(
    clamp(
      activity.troubleChance + hostility * ACTIVITY_HOSTILITY_RISK,
      0,
      ACTIVITY_TROUBLE_CHANCE_MAX,
    ),
  );
}

/**
 * Evaluates an activity end to end: cost, who it lifts, which bonds it mends
 * and how likely it is to backfire. Pure — the trouble roll is the caller's.
 *
 * @param input - The activity, its guest list, the band's relationships, fame
 * and how many activities the turn already saw.
 * @returns The activity's outcome.
 */
export function evaluateActivity(
  input: ActivityEvaluationInput,
): ActivityEvaluation {
  const { activity, participants, relationships } = input;
  const going = new Set(participants.map((participant) => participant.id));

  const saturation = saturationFactor(input.heldThisTurn);
  const happinessDelta = round2(activity.happinessGain * saturation);
  // `level` is a smallint: half a level does not exist, so a diluted gain that
  // does not reach a full point simply does not move the needle.
  const relationshipDelta = Math.floor(activity.relationshipGain * saturation);

  const involved = relationships.filter(
    (relationship) =>
      going.has(relationship.memberAId) && going.has(relationship.memberBId),
  );

  const weakestPair =
    involved.length === 0
      ? null
      : involved.reduce((worst, current) =>
          current.level < worst.level ? current : worst,
        );

  return {
    cost: activityCost(activity, participants.length, input.fameLevel),
    saturation,
    happinessDelta,
    relationshipDelta,
    memberHappiness: participants.map((participant) => ({
      memberId: participant.id,
      happiness: clamp(
        round2(participant.happiness + happinessDelta),
        HAPPINESS_MIN,
        HAPPINESS_MAX,
      ),
    })),
    relationshipLevels: involved.map((relationship) => ({
      memberAId: relationship.memberAId,
      memberBId: relationship.memberBId,
      level: clamp(
        relationship.level + relationshipDelta,
        RELATIONSHIP_LEVEL_MIN,
        RELATIONSHIP_LEVEL_MAX,
      ),
    })),
    weakestPair: weakestPair
      ? {
          memberAId: weakestPair.memberAId,
          memberBId: weakestPair.memberBId,
          level: weakestPair.level,
        }
      : null,
    troubleChance: troubleChance(activity, weakestPair?.level ?? null),
  };
}
