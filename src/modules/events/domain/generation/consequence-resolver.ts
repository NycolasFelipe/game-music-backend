import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type {
  EventConsequence,
  EventOptionConsequence,
  WeightedEventConsequence,
} from "@/modules/events/domain/types/event-consequence";

/** State a member contributes to consequence calculation. */
export interface ConsequenceMember {
  id: string;
  happiness: number;
}

/** A relationship's current level (canonical pair). */
export interface ConsequenceRelationship {
  memberAId: string;
  memberBId: string;
  level: number;
}

/** The absolute new values to apply to the band aggregate. */
export interface BandStateChanges {
  fanCount: number;
  memberHappiness: Array<{ memberId: string; happiness: number }>;
  relationshipLevels: Array<{
    memberAId: string;
    memberBId: string;
    level: number;
  }>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function canonical(id1: string, id2: string): [string, string] {
  return id1 < id2 ? [id1, id2] : [id2, id1];
}

/**
 * Rolls a single consequence from an option consequence. Weighted lists are
 * sampled by their `chance` weights; a direct consequence is returned as-is.
 *
 * @param consequence - The option's consequence (single or weighted list).
 * @returns The selected {@link EventConsequence}.
 */
export function rollConsequence(
  consequence: EventOptionConsequence,
): EventConsequence {
  if (!Array.isArray(consequence)) {
    return consequence;
  }

  const total = consequence.reduce(
    (acc, entry) => acc + Math.max(0, entry.chance),
    0,
  );
  if (total <= 0) {
    return stripChance(consequence[0]);
  }

  let roll = Math.random() * total;
  for (const entry of consequence) {
    roll -= Math.max(0, entry.chance);
    if (roll <= 0) {
      return stripChance(entry);
    }
  }
  return stripChance(consequence[consequence.length - 1]);
}

function stripChance(entry: WeightedEventConsequence): EventConsequence {
  const rest: EventConsequence = { ...entry };
  delete (rest as Partial<WeightedEventConsequence>).chance;
  return rest;
}

/**
 * Derives a happiness change percentage when the consequence does not specify
 * one, from fame impact, relationship tension, money and the event type.
 *
 * @param eventType - The active event's type.
 * @param consequence - The resolved consequence.
 * @param fameImpactPercent - The effective fame impact as a percentage.
 * @returns The derived happiness change percentage (-40..40).
 */
function deriveHappinessChangePercent(
  eventType: ActiveEventType,
  consequence: EventConsequence,
  fameImpactPercent: number,
): number {
  let percent = 0;

  if (fameImpactPercent !== 0) {
    percent += clamp(fameImpactPercent, -30, 30) / 3;
  }

  if (
    consequence.relationshipChanges &&
    consequence.relationshipChanges.length > 0
  ) {
    const sum = consequence.relationshipChanges.reduce(
      (acc, r) => acc + (r.change ?? 0),
      0,
    );
    percent += clamp(sum, -10, 10) * 2;
  }

  if (consequence.moneyChange !== undefined && consequence.moneyChange !== 0) {
    percent += consequence.moneyChange > 0 ? 6 : -6;
  }

  if (percent === 0) {
    switch (eventType) {
      case "crise_financeira":
        percent = -8;
        break;
      case "conflito_membros":
        percent = -10;
        break;
      case "oportunidade_externa":
        percent = 8;
        break;
      case "proposta_contrato":
        percent = 6;
        break;
      case "decisao_criativa":
        percent = 4;
        break;
      default:
        percent = 2;
    }
  }

  return clamp(percent, -40, 40);
}

/**
 * Computes the absolute band-state values to persist after applying a
 * consequence (fan count, member happiness, relationship levels). Ported from
 * the frontend `resolveActiveEvent`/`updateBandStats` logic.
 *
 * @param params - Event type, the resolved consequence, involved character ids,
 * and the current band state (fan count, members, relationships).
 * @returns The absolute new values to apply.
 */
export function computeBandStateChanges(params: {
  eventType: ActiveEventType;
  consequence: EventConsequence;
  involvedCharacterIds: string[];
  currentFanCount: number;
  members: ConsequenceMember[];
  relationships: ConsequenceRelationship[];
}): BandStateChanges {
  const {
    eventType,
    consequence,
    involvedCharacterIds,
    currentFanCount,
    members,
    relationships,
  } = params;

  const baseFans = currentFanCount === 0 ? 10 : currentFanCount;

  // Fan count.
  const deltaFans =
    consequence.fanCountChangeAbsolute !== undefined
      ? Math.round(consequence.fanCountChangeAbsolute)
      : Math.round((baseFans * (consequence.fanCountChange ?? 0)) / 100);
  const fanCount = Math.max(1, currentFanCount + deltaFans);

  // Happiness.
  const fameImpactPercent =
    consequence.fanCountChange !== undefined
      ? consequence.fanCountChange
      : consequence.fanCountChangeAbsolute !== undefined
        ? (consequence.fanCountChangeAbsolute / baseFans) * 100
        : 0;

  const effectivePercent =
    consequence.happinessChangePercent !== undefined
      ? consequence.happinessChangePercent
      : deriveHappinessChangePercent(eventType, consequence, fameImpactPercent);
  const happinessDelta = (effectivePercent * 5) / 100;

  const targetIds =
    involvedCharacterIds.length > 0
      ? involvedCharacterIds
      : members.map((m) => m.id);

  const memberHappiness = members
    .filter((m) => targetIds.includes(m.id))
    .map((m) => ({
      memberId: m.id,
      happiness: clamp(round2(m.happiness + happinessDelta), -5, 5),
    }));

  // Relationships.
  const relationshipLevels = (consequence.relationshipChanges ?? [])
    .map((change) => {
      const [memberAId, memberBId] = canonical(
        change.character1Id,
        change.character2Id,
      );
      const current = relationships.find(
        (r) => r.memberAId === memberAId && r.memberBId === memberBId,
      );
      if (!current) return null;
      return {
        memberAId,
        memberBId,
        level: clamp(current.level + change.change, -5, 5),
      };
    })
    .filter(
      (x): x is BandStateChanges["relationshipLevels"][number] => x !== null,
    );

  return { fanCount, memberHappiness, relationshipLevels };
}
