import {
  MAX_CREATION_EVENTS,
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

/** Builds a "wild idea" gamble event for a member. */
function wildIdea(
  name: string,
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

/** Trait → creation-event builders. Only these traits spawn a character event. */
const TRAIT_EVENT_BUILDERS: Record<string, (name: string) => EventTemplate> = {
  creative: (name) =>
    wildIdea(
      name,
      `${name} sugere gravar uma faixa inteira com sons de liquidificador. "Confia."`,
      0.3,
      1.18,
      0.85,
    ),
  experimental: (name) =>
    wildIdea(
      name,
      `${name} quer incorporar cantos de pássaros da Amazônia no álbum.`,
      0.25,
      1.22,
      0.84,
    ),
  visionary: (name) =>
    wildIdea(
      name,
      `${name} teve um lampejo de genialidade — e ninguém entendeu, mas insiste.`,
      0.35,
      1.2,
      0.86,
    ),
  genius: (name) =>
    wildIdea(
      name,
      `${name} propõe uma virada ousada de arranjo que só um gênio tentaria.`,
      0.5,
      1.2,
      0.9,
    ),
  erratic: (name) =>
    wildIdea(
      name,
      `${name} está imprevisível e quer virar o conceito do disco de cabeça pra baixo.`,
      0.3,
      1.15,
      0.82,
    ),
  perfectionist: (name) => ({
    kind: "perfeccionismo",
    prompt: `${name} exige mais 47 takes até tudo ficar perfeito.`,
    options: [
      {
        id: "caprichar",
        label: "Deixar caprichar",
        description: "Mais tempo no estúdio, mas o acabamento agradece.",
        effect: { type: "fixed", qualityModifier: 1.08 },
      },
      {
        id: "chega",
        label: '"Tá bom assim"',
        description: "Cortar a sessão frustra o perfeccionista.",
        effect: { type: "fixed", qualityModifier: 0.99 },
      },
    ],
  }),
  lazy: (name) => ({
    kind: "preguica",
    prompt: `${name} quer cortar caminho e gravar tudo num take só.`,
    options: [
      {
        id: "cortar",
        label: "Cortar caminho",
        description: "Rápido e sem esforço — e ouve-se isso no resultado.",
        effect: { type: "fixed", qualityModifier: 0.93 },
      },
      {
        id: "insistir",
        label: "Insistir no capricho",
        description: "Contrariar a preguiça custa, mas vale.",
        effect: { type: "fixed", qualityModifier: 1.02 },
      },
    ],
  }),
};

/** Builds a "vision conflict" event between two members. */
function conflictEvent(nameA: string, nameB: string): EventTemplate {
  return {
    kind: "conflito_visao",
    prompt: `${nameA} e ${nameB} brigam pela direção do disco. Com quem você fica?`,
    options: [
      {
        id: "lado_a",
        label: `Ficar com a visão de ${nameA}`,
        description: "Uma direção clara destrava a criação.",
        effect: { type: "fixed", qualityModifier: 1.04 },
      },
      {
        id: "lado_b",
        label: `Ficar com a visão de ${nameB}`,
        description: "Uma direção clara destrava a criação.",
        effect: { type: "fixed", qualityModifier: 1.04 },
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
 * Generates the creation events for a work from its credited members and their
 * relationships. Capped at {@link MAX_CREATION_EVENTS}.
 *
 * @param members - The credited members (id, name, characteristics).
 * @param relationships - Relationships among the band's members.
 * @returns The generated creation events (sequenced from 0).
 */
export function generateCreationEvents(
  members: CreationEventMemberInput[],
  relationships: CreationEventRelationshipInput[],
): GeneratedCreationEvent[] {
  const creditedIds = new Set(members.map((m) => m.id));
  const nameById = new Map(members.map((m) => [m.id, m.name]));
  const templates: EventTemplate[] = [];

  const conflicts = relationships.filter(
    (r) =>
      r.level < 0 &&
      creditedIds.has(r.memberAId) &&
      creditedIds.has(r.memberBId),
  );
  if (conflicts.length > 0) {
    const r = pick(conflicts);
    templates.push(
      conflictEvent(
        nameById.get(r.memberAId) ?? "Um membro",
        nameById.get(r.memberBId) ?? "Outro membro",
      ),
    );
  }

  const characterEvents: EventTemplate[] = [];
  for (const member of members) {
    for (const trait of member.characteristics ?? []) {
      const builder = TRAIT_EVENT_BUILDERS[trait];
      if (builder) {
        characterEvents.push(builder(member.name || "O músico"));
        break; // at most one event per member
      }
    }
  }

  for (const template of shuffle(characterEvents)) {
    if (templates.length >= MAX_CREATION_EVENTS) {
      break;
    }
    templates.push(template);
  }

  return templates
    .slice(0, MAX_CREATION_EVENTS)
    .map((template, index) => ({ ...template, sequence: index }));
}
