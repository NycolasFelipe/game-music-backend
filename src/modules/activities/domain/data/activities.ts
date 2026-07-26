/**
 * Catalog of band activities — what the player can spend cash on to keep the
 * cast together (ADR-0017 §4). Data-driven so costs and effects can be tuned
 * without code changes.
 */

/** Stable activity identifiers. */
export const ACTIVITY_IDS = [
  "jantar",
  "festa",
  "viagem",
  "retiro",
  "terapia",
] as const;

/** An activity identifier. */
export type ActivityId = (typeof ACTIVITY_IDS)[number];

/** Display + economic metadata for an activity. */
export interface Activity {
  id: ActivityId;
  label: string;
  description: string;
  emoji: string;
  /** Cost that does not depend on how many people go. */
  baseCost: number;
  /** Cost added per participant. */
  costPerParticipant: number;
  /** Guest-list bounds. */
  minParticipants: number;
  maxParticipants: number;
  /** Happiness each participant gains at full effect. */
  happinessGain: number;
  /** Relationship levels added to each pair among the participants. */
  relationshipGain: number;
  /** Base chance (`0..1`) of the activity going wrong, before hostility. */
  troubleChance: number;
}

/** The activity catalog. */
export const ACTIVITIES: Activity[] = [
  {
    id: "jantar",
    label: "Jantar da banda",
    description:
      "Uma mesa, comida decente e nenhuma pauta. Barato e sem grande consequência.",
    emoji: "🍽️",
    baseCost: 120,
    costPerParticipant: 60,
    minParticipants: 2,
    maxParticipants: 6,
    happinessGain: 0.4,
    relationshipGain: 1,
    troubleChance: 0.05,
  },
  {
    id: "festa",
    label: "Festa",
    description:
      "Muito humor por real gasto — e a maior chance de alguém falar o que não devia.",
    emoji: "🎉",
    baseCost: 400,
    costPerParticipant: 150,
    minParticipants: 3,
    maxParticipants: 6,
    happinessGain: 1,
    relationshipGain: 1,
    troubleChance: 0.25,
  },
  {
    id: "viagem",
    label: "Viagem de fim de semana",
    description:
      "Sair da cidade junto: levanta o astral e aproxima quem foi, se ninguém se estranhar na estrada.",
    emoji: "✈️",
    baseCost: 900,
    costPerParticipant: 350,
    minParticipants: 2,
    maxParticipants: 6,
    happinessGain: 1.2,
    relationshipGain: 2,
    troubleChance: 0.15,
  },
  {
    id: "retiro",
    label: "Retiro criativo",
    description:
      "Uma casa no meio do nada e instrumentos. Aproxima muito, diverte pouco.",
    emoji: "🏕️",
    baseCost: 1500,
    costPerParticipant: 400,
    minParticipants: 2,
    maxParticipants: 6,
    happinessGain: 0.5,
    relationshipGain: 2,
    troubleChance: 0.08,
  },
  {
    id: "terapia",
    label: "Terapia de grupo",
    description:
      "Não é divertido e ninguém sai mais feliz — mas é o que realmente conserta o que está quebrado.",
    emoji: "🛋️",
    baseCost: 800,
    costPerParticipant: 300,
    minParticipants: 2,
    maxParticipants: 4,
    happinessGain: 0,
    relationshipGain: 3,
    troubleChance: 0.02,
  },
];

/**
 * Finds an activity by id.
 *
 * @param id - The activity id.
 * @returns The activity, or `undefined` when unknown.
 */
export function findActivity(id: string): Activity | undefined {
  return ACTIVITIES.find((activity) => activity.id === id);
}
