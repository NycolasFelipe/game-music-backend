import { ACTIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/active-event-templates";
import type { ActiveEventType } from "@/modules/events/domain/constants/active-event-type.constant";
import type {
  ActiveEventTemplate,
  ActiveEventTemplateOption,
  TemplateConsequence,
  TemplateConsequenceOrWeighted,
} from "@/modules/events/domain/types/active-event-template";
import type {
  EventConsequence,
  EventOptionConsequence,
  ResolvedEventOption,
  WeightedEventConsequence,
} from "@/modules/events/domain/types/event-consequence";
import type {
  EventCharacter,
  EventRelationship,
  GeneratedActiveEvent,
} from "@/modules/events/domain/generation/generated-active-event";

/**
 * Active-event generator — pure functions ported from the `game-music`
 * frontend `activeEventGenerator`. No side effects beyond `Math.random()`.
 */

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hasAny(c: EventCharacter, ids?: string[]): boolean {
  if (!ids || ids.length === 0) return true;
  return ids.some((id) => c.characteristics.includes(id));
}

function hasAll(c: EventCharacter, ids?: string[]): boolean {
  if (!ids || ids.length === 0) return true;
  return ids.every((id) => c.characteristics.includes(id));
}

function bandHasAny(chars: EventCharacter[], ids?: string[]): boolean {
  if (!ids || ids.length === 0) return true;
  return chars.some((c) => hasAny(c, ids));
}

function bandHasAll(chars: EventCharacter[], ids?: string[]): boolean {
  if (!ids || ids.length === 0) return true;
  return ids.every((id) => chars.some((c) => c.characteristics.includes(id)));
}

function relationshipLevelOf(
  relationships: EventRelationship[],
  id1: string,
  id2: string,
): number | null {
  const rel = relationships.find(
    (r) =>
      (r.memberAId === id1 && r.memberBId === id2) ||
      (r.memberAId === id2 && r.memberBId === id1),
  );
  return rel ? rel.level : null;
}

function fillTemplate(text: string, characters: EventCharacter[]): string {
  let result = text;
  characters.forEach((char, index) => {
    result = result.replace(
      new RegExp(`\\{character${index + 1}\\}`, "g"),
      char.name,
    );
    result = result.replace(
      new RegExp(`\\{character${index + 1}_id\\}`, "g"),
      char.id,
    );
  });
  return result;
}

function optionIsVisible(
  option: ActiveEventTemplateOption,
  involved: EventCharacter[],
): boolean {
  const anyInvolvedHas = option.visibleIfAnyInvolvedHas ?? [];
  const anyInvolvedHasAll = option.visibleIfAnyInvolvedHasAll ?? [];

  if (
    anyInvolvedHas.length > 0 &&
    !involved.some((c) => hasAny(c, anyInvolvedHas))
  ) {
    return false;
  }
  if (
    anyInvolvedHasAll.length > 0 &&
    !involved.some((c) => hasAll(c, anyInvolvedHasAll))
  ) {
    return false;
  }

  const posOr = option.visibleIfCharacterHas ?? [];
  const posAnd = option.visibleIfCharacterHasAll ?? [];
  const maxPositions = Math.max(posOr.length, posAnd.length);

  for (let i = 0; i < maxPositions; i += 1) {
    const c = involved[i];
    const requiredAny = posOr[i] ?? [];
    const requiredAll = posAnd[i] ?? [];
    if ((requiredAny.length > 0 || requiredAll.length > 0) && !c) return false;
    if (!hasAny(c, requiredAny)) return false;
    if (!hasAll(c, requiredAll)) return false;
  }

  return true;
}

function resolveSingleConsequence(
  template: TemplateConsequence,
  involved: EventCharacter[],
): EventConsequence {
  const { descriptionTemplate, relationshipChanges, ...rest } = template;
  return {
    ...rest,
    description: fillTemplate(descriptionTemplate, involved),
    relationshipChanges: relationshipChanges?.map((change) => ({
      character1Id: fillTemplate(change.character1Id, involved),
      character2Id: fillTemplate(change.character2Id, involved),
      change: change.change,
    })),
  };
}

function resolveConsequence(
  consequence: TemplateConsequenceOrWeighted,
  involved: EventCharacter[],
): EventOptionConsequence {
  if (Array.isArray(consequence)) {
    return consequence.map((entry): WeightedEventConsequence => {
      const { chance, ...rest } = entry;
      return { ...resolveSingleConsequence(rest, involved), chance };
    });
  }
  return resolveSingleConsequence(consequence, involved);
}

function pairCoversAll(
  a: EventCharacter,
  b: EventCharacter,
  ids: string[],
): boolean {
  if (!ids || ids.length === 0) return true;
  return ids.every(
    (id) => a.characteristics.includes(id) || b.characteristics.includes(id),
  );
}

type PositionShape = Pick<
  ActiveEventTemplate,
  | "requiredInvolvedCharacteristics"
  | "requiredInvolvedCharacteristicsAll"
  | "requiredCharacterCharacteristics"
  | "requiredCharacterCharacteristicsAll"
>;

function pairSatisfiesPositions(
  template: PositionShape,
  a: EventCharacter,
  b: EventCharacter,
): boolean {
  const positionAny = template.requiredCharacterCharacteristics ?? [];
  const positionAll = template.requiredCharacterCharacteristicsAll ?? [];
  const hasPos =
    positionAny.some((arr) => (arr ?? []).length > 0) ||
    positionAll.some((arr) => (arr ?? []).length > 0);
  if (!hasPos) return true;

  const fits = (c: EventCharacter, i: number): boolean =>
    hasAny(c, positionAny[i] ?? []) && hasAll(c, positionAll[i] ?? []);

  return (fits(a, 0) && fits(b, 1)) || (fits(b, 0) && fits(a, 1));
}

function orderPair(
  template: PositionShape,
  pair: [EventCharacter, EventCharacter],
): [EventCharacter, EventCharacter] {
  const [a, b] = pair;
  const positionAny = template.requiredCharacterCharacteristics ?? [];
  const positionAll = template.requiredCharacterCharacteristicsAll ?? [];
  const hasPos =
    positionAny.some((arr) => (arr ?? []).length > 0) ||
    positionAll.some((arr) => (arr ?? []).length > 0);

  const fits = (c: EventCharacter, i: number): boolean =>
    hasAny(c, positionAny[i] ?? []) && hasAll(c, positionAll[i] ?? []);

  if (hasPos) {
    const abOk = fits(a, 0) && fits(b, 1);
    const baOk = fits(b, 0) && fits(a, 1);
    if (abOk && !baOk) return [a, b];
    if (baOk && !abOk) return [b, a];
  }

  const allReq = template.requiredInvolvedCharacteristicsAll ?? [];
  if (allReq.length > 0) {
    const aAll = hasAll(a, allReq);
    const bAll = hasAll(b, allReq);
    if (!aAll && bAll) return [b, a];
    if (aAll && !bAll) return [a, b];
  }

  const anyReq = template.requiredInvolvedCharacteristics ?? [];
  if (anyReq.length > 0) {
    const aAny = hasAny(a, anyReq);
    const bAny = hasAny(b, anyReq);
    if (!aAny && bAny) return [b, a];
    if (aAny && !bAny) return [a, b];
  }

  return [a, b];
}

function selectPair(
  template: ActiveEventTemplate,
  characters: EventCharacter[],
  relationships: EventRelationship[],
): [EventCharacter, EventCharacter] | null {
  if (characters.length < 2) return null;

  const involvedAny = template.requiredInvolvedCharacteristics;
  const satisfies = involvedAny
    ? (c: EventCharacter) => hasAny(c, involvedAny)
    : () => true;
  const requiredAll = template.requiredInvolvedCharacteristicsAll ?? [];

  const problematic: [EventCharacter, EventCharacter][] = [];
  const any: [EventCharacter, EventCharacter][] = [];

  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      const a = characters[i];
      const b = characters[j];
      if (!satisfies(a) && !satisfies(b)) continue;
      if (requiredAll.length > 0 && !pairCoversAll(a, b, requiredAll)) continue;
      if (!pairSatisfiesPositions(template, a, b)) continue;

      const level = relationshipLevelOf(relationships, a.id, b.id);
      if (level !== null && level <= 0) problematic.push([a, b]);
      else any.push([a, b]);
    }
  }

  const pool = problematic.length > 0 ? problematic : any;
  if (pool.length === 0) return null;
  return orderPair(template, pickRandom(pool));
}

function selectSolo(
  template: ActiveEventTemplate,
  characters: EventCharacter[],
): EventCharacter[] {
  const involvedAll = template.requiredInvolvedCharacteristicsAll;
  const involvedAny = template.requiredInvolvedCharacteristics;

  let pool =
    involvedAll && involvedAll.length > 0
      ? characters.filter((c) => hasAll(c, involvedAll))
      : involvedAny
        ? characters.filter((c) => hasAny(c, involvedAny))
        : characters;

  const posAny = template.requiredCharacterCharacteristics?.[0] ?? [];
  const posAll = template.requiredCharacterCharacteristicsAll?.[0] ?? [];
  if (posAny.length > 0 || posAll.length > 0) {
    pool = pool.filter((c) => hasAny(c, posAny) && hasAll(c, posAll));
  }

  return pool.length === 0 ? [] : [pickRandom(pool)];
}

/**
 * Generates one eligible active event for a band's current state, or `null`
 * when no suitable event could be built.
 *
 * @param params - Year, characters, relationships, fan count and the set of
 * recently used template ids to avoid repeats.
 * @returns The generated active event, or `null`.
 */
export function generateActiveEvent(params: {
  year: number;
  characters: EventCharacter[];
  relationships: EventRelationship[];
  fanCount: number;
  recentTemplateIds?: ReadonlySet<string>;
}): GeneratedActiveEvent | null {
  const { year, characters, relationships, fanCount } = params;
  const recent = params.recentTemplateIds ?? new Set<string>();
  if (characters.length === 0) return null;

  const MAX_ATTEMPTS = 15;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const random = Math.random();
    let selectedType: ActiveEventType;
    if (random < 0.4 && characters.length >= 2) {
      selectedType = "conflito_membros";
    } else if (random < 0.7) {
      selectedType = "oportunidade_externa";
    } else {
      selectedType = "decisao_criativa";
    }

    const compatible = ACTIVE_EVENT_TEMPLATES.filter((t) => {
      if (t.type !== "" && t.type !== selectedType) return false;
      if (t.minYear !== undefined && year < t.minYear) return false;
      if (t.maxYear !== undefined && year > t.maxYear) return false;
      if (t.minFanCount !== undefined && fanCount < t.minFanCount) return false;
      if (t.maxFanCount !== undefined && fanCount > t.maxFanCount) return false;
      return (
        bandHasAny(characters, t.requiredBandCharacteristics) &&
        bandHasAll(characters, t.requiredBandCharacteristicsAll)
      );
    });
    if (compatible.length === 0) continue;

    const template = pickRandom(compatible);
    if (recent.has(template.id)) continue;

    let involved: EventCharacter[] = [];
    if (template.requiredCharacters === 2) {
      const pair = selectPair(template, characters, relationships);
      if (!pair) continue;
      involved = pair;
    } else if (template.requiredCharacters === 1) {
      involved = selectSolo(template, characters);
      if (involved.length === 0) continue;
    }

    const visibleOptions = template.options.filter((opt) =>
      optionIsVisible(opt, involved),
    );
    if (visibleOptions.length === 0) continue;

    const options: ResolvedEventOption[] = visibleOptions.map((opt, index) => ({
      id: `option_${index}`,
      label: fillTemplate(opt.label, involved),
      description: fillTemplate(opt.description, involved),
      consequence: resolveConsequence(opt.consequence, involved),
    }));
    shuffleInPlace(options);

    return {
      templateId: template.id,
      year,
      type: template.type,
      title: fillTemplate(template.title, involved),
      description: fillTemplate(template.descriptionTemplate, involved),
      involvedCharacterIds: involved.map((c) => c.id),
      options,
    };
  }

  return null;
}
