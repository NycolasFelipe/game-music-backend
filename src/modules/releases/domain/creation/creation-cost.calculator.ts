import {
  HAPPINESS_MAX,
  HAPPINESS_MIN,
} from "@/modules/band-members/domain/constants/member-rules.constant";
import {
  RELATIONSHIP_LEVEL_MAX,
  RELATIONSHIP_LEVEL_MIN,
} from "@/modules/bands/domain/constants/relationship.constant";
import type { CreationEventCost } from "@/modules/releases/domain/types/creation-event";

/**
 * Creation-cost calculator (ADR-0019). Turns the side cost of a chosen studio
 * option into absolute band changes. Pure: no I/O, no randomness.
 */

/** A band member as the calculator needs it. */
export interface CreationCostMemberInput {
  id: string;
  happiness: number;
}

/** A relationship between two members. */
export interface CreationCostRelationshipInput {
  memberAId: string;
  memberBId: string;
  level: number;
}

/** Absolute changes to apply after a studio choice. */
export interface CreationCostOutcome {
  /** Production turns to add to the work (0 when none). */
  extraProductionTurns: number;
  /** New absolute happiness per affected member. */
  memberHappiness: Array<{ memberId: string; happiness: number }>;
  /** New absolute level per affected pair, in the stored pair order. */
  relationshipLevels: Array<{
    memberAId: string;
    memberBId: string;
    level: number;
  }>;
}

/**
 * Clamps a value to a range.
 *
 * @param value - The value to clamp.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns The clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Rounds to two decimals, like the other happiness calculators.
 *
 * @param value - The value to round.
 * @returns The rounded value.
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Resolves an option's cost against the band as it is now. Members who left
 * since the session opened, and pairs with no stored relationship, are skipped:
 * the cost falls on whoever is still there.
 *
 * @param cost - The option's cost, or `undefined` for a free option.
 * @param members - The band's current members.
 * @param relationships - The band's current relationships.
 * @returns The absolute changes to apply (empty lists when nothing changes).
 */
export function resolveCreationCost(
  cost: CreationEventCost | undefined,
  members: CreationCostMemberInput[],
  relationships: CreationCostRelationshipInput[],
): CreationCostOutcome {
  const byId = new Map(members.map((member) => [member.id, member]));

  const memberHappiness = (cost?.happiness ?? []).flatMap((change) => {
    const member = byId.get(change.memberId);
    if (!member) {
      return [];
    }
    return [
      {
        memberId: member.id,
        happiness: clamp(
          round2(member.happiness + change.delta),
          HAPPINESS_MIN,
          HAPPINESS_MAX,
        ),
      },
    ];
  });

  const relationshipLevels = (cost?.relationships ?? []).flatMap((change) => {
    const pair = relationships.find(
      (rel) =>
        (rel.memberAId === change.memberAId &&
          rel.memberBId === change.memberBId) ||
        (rel.memberAId === change.memberBId &&
          rel.memberBId === change.memberAId),
    );
    if (!pair) {
      return [];
    }
    return [
      {
        memberAId: pair.memberAId,
        memberBId: pair.memberBId,
        level: clamp(
          pair.level + change.delta,
          RELATIONSHIP_LEVEL_MIN,
          RELATIONSHIP_LEVEL_MAX,
        ),
      },
    ];
  });

  return {
    extraProductionTurns: Math.max(0, cost?.extraProductionTurns ?? 0),
    memberHappiness,
    relationshipLevels,
  };
}
