import {
  HOSTILITY_WEIGHT_PER_LEVEL,
  RECENT_INVOLVEMENT_FACTOR,
} from "@/modules/events/domain/constants/cast-selection.constant";
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

/**
 * Matches an inflected fragment, `{characterN:masculine|feminine|neutral}`
 * (ADR-0027). The neutral form is a construction without inflection.
 */
const INFLECTION_MARKER = /\{character(\d):([^|{}]*)\|([^|{}]*)\|([^|{}]*)\}/g;

/**
 * Fills a template: first the inflected fragments, by the gender of the
 * character each one refers to, then the names and ids.
 *
 * @param text - The template text.
 * @param characters - The cast, in position order.
 * @returns The text ready to show.
 */
export function fillTemplate(
  text: string,
  characters: EventCharacter[],
): string {
  let result = text.replace(
    INFLECTION_MARKER,
    (
      _match,
      position: string,
      masculine: string,
      feminine: string,
      neutral: string,
    ) => {
      const gender = characters[Number(position) - 1]?.gender;
      if (gender === "female") return feminine;
      if (gender === "male") return masculine;
      return neutral;
    },
  );
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
  const { descriptionTemplate, relationshipChanges, resultLabel, ...rest } =
    template;
  return {
    ...rest,
    ...(resultLabel !== undefined
      ? { resultLabel: fillTemplate(resultLabel, involved) }
      : {}),
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

/**
 * Checks whether a relationship level satisfies a template's
 * `min/maxRelationshipLevel` bounds (when declared). When a bound is present but
 * no relationship exists, the pair is rejected.
 *
 * @param template - The template carrying the optional bounds.
 * @param level - The pair's current relationship level (or `null`).
 * @returns `true` when within bounds (or no bounds declared).
 */
function relationshipWithinBounds(
  template: Pick<
    ActiveEventTemplate,
    "minRelationshipLevel" | "maxRelationshipLevel"
  >,
  level: number | null,
): boolean {
  const { minRelationshipLevel: min, maxRelationshipLevel: max } = template;
  if (min === undefined && max === undefined) return true;
  if (level === null) return false;
  if (min !== undefined && level < min) return false;
  if (max !== undefined && level > max) return false;
  return true;
}

/**
 * Draws one item by weight.
 *
 * @param items - The candidates with their weights (all positive).
 * @returns The drawn item, or `null` when there is none.
 */
function pickWeighted<T>(items: { item: T; weight: number }[]): T | null {
  const total = items.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const entry of items) {
    roll -= entry.weight;
    if (roll < 0) return entry.item;
  }
  return items[items.length - 1].item;
}

/**
 * Weight multiplier that spreads events across the band: each member who was
 * in the previous event halves the weight (ADR-0028).
 *
 * @param ids - The candidate's member ids.
 * @param lastInvolved - Who was in the band's previous event.
 * @returns The multiplier (1, 0.5 or 0.25).
 */
function rotationFactor(
  ids: string[],
  lastInvolved: ReadonlySet<string>,
): number {
  return ids.reduce(
    (factor, id) =>
      lastInvolved.has(id) ? factor * RECENT_INVOLVEMENT_FACTOR : factor,
    1,
  );
}

/**
 * Picks the pair for a two-character template among every pair that meets its
 * trait, position and relationship requirements. Member conflicts lean toward
 * hostile pairs by weight; other types draw evenly; members of the previous
 * event weigh less (ADR-0028).
 *
 * @param template - The template being cast.
 * @param characters - The band's members.
 * @param relationships - The band's relationships.
 * @param lastInvolved - Who was in the band's previous event.
 * @returns The ordered pair, or `null` when no pair fits.
 */
function selectPair(
  template: ActiveEventTemplate,
  characters: EventCharacter[],
  relationships: EventRelationship[],
  lastInvolved: ReadonlySet<string>,
): [EventCharacter, EventCharacter] | null {
  if (characters.length < 2) return null;

  const involvedAny = template.requiredInvolvedCharacteristics;
  const satisfies = involvedAny
    ? (c: EventCharacter) => hasAny(c, involvedAny)
    : () => true;
  const requiredAll = template.requiredInvolvedCharacteristicsAll ?? [];
  const leansHostile = template.type === "conflito_membros";

  const candidates: {
    item: [EventCharacter, EventCharacter];
    weight: number;
  }[] = [];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      const a = characters[i];
      const b = characters[j];
      if (!satisfies(a) && !satisfies(b)) continue;
      if (requiredAll.length > 0 && !pairCoversAll(a, b, requiredAll)) continue;
      if (!pairSatisfiesPositions(template, a, b)) continue;

      const level = relationshipLevelOf(relationships, a.id, b.id);
      // Enforce the template's relationship-level bounds (between the pair).
      if (!relationshipWithinBounds(template, level)) continue;
      const hostility = leansHostile ? Math.max(0, -(level ?? 0)) : 0;
      const weight =
        (1 + hostility * HOSTILITY_WEIGHT_PER_LEVEL) *
        rotationFactor([a.id, b.id], lastInvolved);
      candidates.push({ item: [a, b], weight });
    }
  }

  const pair = pickWeighted(candidates);
  return pair ? orderPair(template, pair) : null;
}

function selectSolo(
  template: ActiveEventTemplate,
  characters: EventCharacter[],
  lastInvolved: ReadonlySet<string>,
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

  const picked = pickWeighted(
    pool.map((c) => ({
      item: c,
      weight: rotationFactor([c.id], lastInvolved),
    })),
  );
  return picked ? [picked] : [];
}

/**
 * Builds a concrete event from a template and an explicit cast, filling the
 * text placeholders and keeping only the options that cast makes visible.
 * Exposed so callers that already know *which* event to raise — an activity
 * that went wrong (ADR-0017 §3), for instance — can skip the random selection.
 *
 * @param template - The template to instantiate.
 * @param involved - The characters, in template position order.
 * @param year - The band's live year to stamp on the event.
 * @returns The generated event, or `null` when no option survives the cast.
 */
export function instantiateActiveEvent(
  template: ActiveEventTemplate,
  involved: EventCharacter[],
  year: number,
): GeneratedActiveEvent | null {
  const visibleOptions = template.options.filter((opt) =>
    optionIsVisible(opt, involved),
  );
  if (visibleOptions.length === 0) return null;

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

/**
 * Generates one eligible active event for a band's current state, or `null`
 * when no suitable event could be built.
 *
 * @param params - Year, characters, relationships, fan count and the set of
 * template ids to skip (every template the band already saw, ADR-0031).
 * @returns The generated active event, or `null`.
 */
export function generateActiveEvent(params: {
  year: number;
  characters: EventCharacter[];
  relationships: EventRelationship[];
  fanCount: number;
  /** Templates to skip: every one the band already saw (ADR-0031 §1). */
  recentTemplateIds?: ReadonlySet<string>;
  /** Who was in the band's previous event; they weigh less (ADR-0028). */
  lastInvolvedIds?: readonly string[];
}): GeneratedActiveEvent | null {
  const { year, characters, relationships, fanCount } = params;
  const recent = params.recentTemplateIds ?? new Set<string>();
  const lastInvolved = new Set(params.lastInvolvedIds ?? []);
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

    // Seen templates leave the pool before the draw, so a repeat never burns
    // one of the attempts.
    const compatible = ACTIVE_EVENT_TEMPLATES.filter((t) => {
      if (recent.has(t.id)) return false;
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

    let involved: EventCharacter[] = [];
    if (template.requiredCharacters === 2) {
      const pair = selectPair(
        template,
        characters,
        relationships,
        lastInvolved,
      );
      if (!pair) continue;
      involved = pair;
    } else if (template.requiredCharacters === 1) {
      involved = selectSolo(template, characters, lastInvolved);
      if (involved.length === 0) continue;
    }

    const event = instantiateActiveEvent(template, involved, year);
    if (!event) continue;

    return event;
  }

  return null;
}
