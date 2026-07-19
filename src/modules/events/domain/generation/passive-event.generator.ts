import {
  PASSIVE_EVENT_PROBABILITIES,
  type PassiveEventType,
} from "@/modules/events/domain/constants/passive-event-type.constant";
import { ALL_ARTISTS } from "@/modules/events/domain/data/artists";
import { PASSIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/passive-event-templates";
import {
  ALBUM_NAMES,
  CANCELLATION_REASONS,
  PUBLIC_REVIEWS,
  SINGLE_NAMES,
  TOUR_NAMES,
} from "@/modules/events/domain/data/passive-event-resources";
import type { Artist } from "@/modules/events/domain/types/artist";
import type { PassiveEventTemplate } from "@/modules/events/domain/types/passive-event-template";
import type {
  GeneratedPassiveEvent,
  RecentPassiveEvent,
} from "@/modules/events/domain/generation/generated-passive-event";

/**
 * Passive-event generator — pure functions ported from the `game-music`
 * frontend `eventGenerator`. No side effects beyond `Math.random()`.
 */

const MAX_ATTEMPTS = 10;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Returns the artists active in a given year.
 *
 * @param year - The year to check.
 * @returns The active artists.
 */
function getActiveArtists(year: number): Artist[] {
  return ALL_ARTISTS.filter(
    (a) =>
      a.ano_inicio <= year &&
      (a.ano_fim_carreira === null || a.ano_fim_carreira >= year),
  );
}

/**
 * Picks an event type using the cumulative probability weights.
 *
 * @returns The selected passive event type.
 */
function selectType(): PassiveEventType {
  const random = Math.random() * 100;
  let cumulative = 0;
  for (const [type, probability] of Object.entries(
    PASSIVE_EVENT_PROBABILITIES,
  )) {
    cumulative += probability;
    if (random <= cumulative) {
      return type as PassiveEventType;
    }
  }
  return "colaboracao_musical";
}

/**
 * Filters active artists by a template's compatibility tags. Note: career
 * length is computed against the game `year` (a deliberate correction over the
 * frontend, which used the real system year).
 *
 * @param artists - The active artists.
 * @param compatibilidade - The template's compatibility tags.
 * @param year - The game year.
 * @returns The eligible artists.
 */
function filterByCompatibility(
  artists: Artist[],
  compatibilidade: string[],
  year: number,
): Artist[] {
  if (compatibilidade.includes("qualquer_um")) return artists;
  if (compatibilidade.includes("solo_ativos")) {
    return artists.filter((a) => a.solo);
  }
  if (compatibilidade.includes("bandas")) {
    return artists.filter((a) => !a.solo);
  }
  if (compatibilidade.includes("carreira_longa")) {
    return artists.filter((a) => year - a.ano_inicio >= 30);
  }
  return artists;
}

/**
 * Produces a public-review phrase (positive/neutral/negative).
 *
 * @returns The review phrase.
 */
function generateReview(): string {
  const random = Math.random();
  if (random < 0.5) return pick(PUBLIC_REVIEWS.positivas);
  if (random < 0.8) return pick(PUBLIC_REVIEWS.neutras);
  return pick(PUBLIC_REVIEWS.negativas);
}

/**
 * Fills a template's placeholders with real artists and resources.
 *
 * @param template - The template to fill.
 * @param artists - The selected artists.
 * @param year - The game year.
 * @returns The rendered description.
 */
function fillTemplate(
  template: PassiveEventTemplate,
  artists: Artist[],
  year: number,
): string {
  let text = template.template;

  if (template.requiredArtists === 1) {
    text = text.replace("{artista}", artists[0].nome);
    text = text.replace("{banda}", artists[0].nome);
    if (text.includes("{anos}")) {
      text = text.replace("{anos}", String(year - artists[0].ano_inicio));
    }
  } else if (template.requiredArtists === 2) {
    text = text.replace("{artista1}", artists[0].nome);
    text = text.replace("{artista2}", artists[1].nome);
  }

  if (text.includes("{nome_single}")) {
    text = text.replace("{nome_single}", pick(SINGLE_NAMES));
  }
  if (text.includes("{nome_album}")) {
    text = text.replace("{nome_album}", pick(ALBUM_NAMES));
  }
  if (text.includes("{nome_turne}")) {
    text = text.replace("{nome_turne}", pick(TOUR_NAMES));
  }
  if (text.includes("{motivo}")) {
    text = text.replace("{motivo}", pick(CANCELLATION_REASONS));
  }
  if (text.includes("{avaliacao}")) {
    text = text.replace("{avaliacao}", generateReview());
  }

  return text;
}

/**
 * Checks whether a candidate event is too similar to recent ones: same template
 * with a shared artist, or the exact same set of artists.
 *
 * @param templateId - The candidate template id.
 * @param artists - The candidate artist names.
 * @param recent - Recently generated events (already within the year window).
 * @returns `true` when too similar.
 */
function isSimilar(
  templateId: string,
  artists: string[],
  recent: RecentPassiveEvent[],
): boolean {
  for (const r of recent) {
    if (r.templateId === templateId) {
      if (artists.some((a) => r.artists.includes(a))) return true;
    }
    if (
      artists.length === r.artists.length &&
      artists.every((a) => r.artists.includes(a))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Generates one passive event for a year, avoiding events too similar to the
 * recent ones. Returns `null` when it cannot produce a fresh event.
 *
 * @param year - The game year.
 * @param recent - Recently generated events (within the 3-year window).
 * @returns The generated passive event, or `null`.
 */
export function generatePassiveEvent(
  year: number,
  recent: RecentPassiveEvent[] = [],
): GeneratedPassiveEvent | null {
  const activeArtists = getActiveArtists(year);
  if (activeArtists.length === 0) return null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const type = selectType();
    const compatibleTemplates = PASSIVE_EVENT_TEMPLATES.filter(
      (t) => t.type === type,
    );
    if (compatibleTemplates.length === 0) continue;

    const template = pick(compatibleTemplates);

    let eligible = filterByCompatibility(
      activeArtists,
      template.compatibilidade,
      year,
    );
    if (eligible.length < template.requiredArtists) {
      eligible = activeArtists;
    }
    if (eligible.length < template.requiredArtists) continue;

    const selected = pickMany(eligible, template.requiredArtists);
    const artistNames = selected.map((a) => a.nome);

    if (isSimilar(template.id, artistNames, recent)) continue;

    return {
      templateId: template.id,
      year,
      type: template.type,
      description: fillTemplate(template, selected, year),
      artists: artistNames,
    };
  }

  return null;
}
