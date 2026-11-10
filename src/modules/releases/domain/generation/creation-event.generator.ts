import {
  LAZY_INSIST_HAPPINESS_PENALTY,
  OVERRULED_HAPPINESS_PENALTY,
  STUDIO_EXTRA_TAKES_TURNS,
  VISION_CONFLICT_RELATIONSHIP_PENALTY,
} from "@/modules/releases/domain/constants/release.constant";
import {
  MAX_CREATION_EVENTS,
  type CreationEventCost,
  type GeneratedCreationEvent,
} from "@/modules/releases/domain/types/creation-event";

/**
 * Creation-event generator (ADR-0008 §6). Produces a short sequence of
 * interactive decisions from the credited members: vision conflicts between
 * members who dislike each other, and trait-specific events (a wild idea from an
 * eccentric member, a perfectionist demanding another take, …). Pure beyond
 * `Math.random()`.
 */

/** A credited member as consumed by the generator. */
export interface CreationEventMemberInput {
  id: string;
  name: string;
  characteristics: string[];
}

/** A relationship between two members. */
export interface CreationEventRelationshipInput {
  memberAId: string;
  memberBId: string;
  level: number;
}

/** A creation event before its sequence is assigned. */
type EventTemplate = Omit<GeneratedCreationEvent, "sequence">;

/** Picks a random element from a non-empty array. */
function pick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** Returns a shuffled copy (Fisher–Yates). */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** The member an event is about: id for its costs, name for its text. */
interface EventSubject {
  id: string;
  name: string;
}

/**
 * Builds a "wild idea" gamble event. The odds are tuned so the gamble's expected
 * modifier sits near 1 (ADR-0019): taking it is a bet on variance, not a trap.
 *
 * @param prompt - The event text, already naming the member.
 * @param successChance - Probability that the idea works (0..1).
 * @param successModifier - Quality modifier when it works.
 * @param failureModifier - Quality modifier when it flops.
 * @returns The event template.
 */
function wildIdea(
  prompt: string,
  successChance: number,
  successModifier: number,
  failureModifier: number,
): EventTemplate {
  return {
    kind: "ideia_maluca",
    prompt,
    options: [
      {
        id: "topar",
        label: "Topar a ideia",
        description:
          "Alto risco, alta recompensa — pode ser genial ou um desastre.",
        effect: {
          type: "probabilistic",
          successChance,
          successModifier,
          failureModifier,
        },
      },
      {
        id: "recusar",
        label: "Seguir no seguro",
        description: "Nada de loucuras. O disco segue como planejado.",
        effect: { type: "fixed", qualityModifier: 1 },
      },
    ],
  };
}

/**
 * Cost of overruling one member: their happiness drops (ADR-0019).
 *
 * @param memberId - The overruled member.
 * @param penalty - Happiness the member loses (positive number).
 * @returns The option cost.
 */
function overruled(
  memberId: string,
  penalty = OVERRULED_HAPPINESS_PENALTY,
): CreationEventCost {
  return {
    happiness: [{ memberId, delta: -penalty }],
  };
}

/** Trait → creation-event builders. Only these traits spawn a character event. */
const TRAIT_EVENT_BUILDERS: Record<
  string,
  (member: EventSubject) => EventTemplate
> = {
  creative: ({ name }) =>
    wildIdea(
      `${name} sugere gravar uma faixa inteira com sons de liquidificador. "Confia."`,
      0.45,
      1.18,
      0.85,
    ),
  experimental: ({ name }) =>
    wildIdea(
      `${name} quer incorporar cantos de pássaros da Amazônia no álbum.`,
      0.42,
      1.22,
      0.84,
    ),
  visionary: ({ name }) =>
    wildIdea(
      `${name} teve um lampejo de genialidade — e ninguém entendeu, mas insiste.`,
      0.41,
      1.2,
      0.86,
    ),
  genius: ({ name }) =>
    wildIdea(
      `${name} propõe uma virada ousada de arranjo que só um gênio tentaria.`,
      0.5,
      1.2,
      0.9,
    ),
  erratic: ({ name }) =>
    wildIdea(
      `${name} está imprevisível e quer virar o conceito do disco de cabeça pra baixo.`,
      0.55,
      1.15,
      0.82,
    ),
  perfectionist: ({ id, name }) => ({
    kind: "perfeccionismo",
    prompt: `${name} exige mais 47 takes até tudo ficar perfeito.`,
    options: [
      {
        id: "caprichar",
        label: "Deixar caprichar",
        description: "Mais um turno no estúdio, mas o acabamento agradece.",
        effect: { type: "fixed", qualityModifier: 1.25 },
        cost: { extraProductionTurns: STUDIO_EXTRA_TAKES_TURNS },
      },
      {
        id: "chega",
        label: '"Tá bom assim"',
        description: "Cortar a sessão frustra o perfeccionista.",
        effect: { type: "fixed", qualityModifier: 0.99 },
        cost: overruled(id),
      },
    ],
  }),
  lazy: ({ id, name }) => ({
    kind: "preguica",
    prompt: `${name} quer cortar caminho e gravar tudo num take só.`,
    options: [
      {
        id: "cortar",
        label: "Cortar caminho",
        description: "Rápido e sem esforço — e ouve-se isso no resultado.",
        effect: { type: "fixed", qualityModifier: 0.98 },
      },
      {
        id: "insistir",
        label: "Insistir no capricho",
        description: `Contrariar a preguiça custa: ${name} fica de mau humor, mas vale.`,
        effect: { type: "fixed", qualityModifier: 1.02 },
        cost: overruled(id, LAZY_INSIST_HAPPINESS_PENALTY),
      },
    ],
  }),
};

/**
 * Cost of siding with one member in a vision conflict: the other is overruled
 * and the pair's relationship sours (ADR-0019).
 *
 * @param loserId - The member whose vision lost.
 * @param memberAId - First member of the pair.
 * @param memberBId - Second member of the pair.
 * @returns The option cost.
 */
function sideCost(
  loserId: string,
  memberAId: string,
  memberBId: string,
): CreationEventCost {
  return {
    ...overruled(loserId),
    relationships: [
      { memberAId, memberBId, delta: -VISION_CONFLICT_RELATIONSHIP_PENALTY },
    ],
  };
}

/**
 * Builds a "vision conflict" event between two members.
 *
 * @param a - The first member of the clashing pair.
 * @param b - The second member of the clashing pair.
 * @returns The event template.
 */
function conflictEvent(a: EventSubject, b: EventSubject): EventTemplate {
  return {
    kind: "conflito_visao",
    prompt: `${a.name} e ${b.name} brigam pela direção do disco. Com quem você fica?`,
    options: [
      {
        id: "lado_a",
        label: `Ficar com a visão de ${a.name}`,
        description: `Uma direção clara destrava a criação, mas ${b.name} perde a briga e a relação dos dois piora.`,
        effect: { type: "fixed", qualityModifier: 1.04 },
        cost: sideCost(b.id, a.id, b.id),
      },
      {
        id: "lado_b",
        label: `Ficar com a visão de ${b.name}`,
        description: `Uma direção clara destrava a criação, mas ${a.name} perde a briga e a relação dos dois piora.`,
        effect: { type: "fixed", qualityModifier: 1.04 },
        cost: sideCost(a.id, a.id, b.id),
      },
      {
        id: "meio_termo",
        label: "Impor um meio-termo",
        description: "Ninguém fica feliz e a obra fica morna.",
        effect: { type: "fixed", qualityModifier: 0.97 },
      },
    ],
  };
}

/**
 * Generates the creation events of one studio session from the credited members
 * and their relationships. Capped at {@link MAX_CREATION_EVENTS}, or at the
 * caller's `limit` — the production spreads the sessions over its turns
 * (ADR-0015 §3), so each call asks for the slice it needs and continues the
 * sequence numbering from where the work left off.
 *
 * @param members - The credited members (id, name, characteristics).
 * @param relationships - Relationships among the band's members.
 * @param options - How many events to take, where to resume the sequence, and
 *   which kinds the work already used (so a long production does not replay the
 *   same drama every session).
 * @returns The generated creation events.
 */
export function generateCreationEvents(
  members: CreationEventMemberInput[],
  relationships: CreationEventRelationshipInput[],
  options: {
    limit?: number;
    startSequence?: number;
    excludeKinds?: string[];
  } = {},
): GeneratedCreationEvent[] {
  const limit = Math.max(
    0,
    Math.min(options.limit ?? MAX_CREATION_EVENTS, MAX_CREATION_EVENTS),
  );
  const startSequence = options.startSequence ?? 0;
  const exclude = new Set(options.excludeKinds ?? []);
  const creditedIds = new Set(members.map((m) => m.id));
  const nameById = new Map(members.map((m) => [m.id, m.name]));
  const templates: EventTemplate[] = [];

  const conflicts = relationships.filter(
    (r) =>
      r.level < 0 &&
      creditedIds.has(r.memberAId) &&
      creditedIds.has(r.memberBId),
  );
  if (conflicts.length > 0 && !exclude.has("conflito_visao")) {
    const r = pick(conflicts);
    templates.push(
      conflictEvent(
        { id: r.memberAId, name: nameById.get(r.memberAId) ?? "Um membro" },
        { id: r.memberBId, name: nameById.get(r.memberBId) ?? "Outro membro" },
      ),
    );
  }

  const characterEvents: EventTemplate[] = [];
  for (const member of members) {
    for (const trait of member.characteristics ?? []) {
      const builder = TRAIT_EVENT_BUILDERS[trait];
      if (builder) {
        characterEvents.push(
          builder({ id: member.id, name: member.name || "O músico" }),
        );
        break; // at most one event per member
      }
    }
  }

  for (const template of shuffle(characterEvents)) {
    if (templates.length >= limit) {
      break;
    }
    if (exclude.has(template.kind)) {
      continue;
    }
    templates.push(template);
  }

  return templates.slice(0, limit).map((template, index) => ({
    ...template,
    sequence: startSequence + index,
  }));
}
