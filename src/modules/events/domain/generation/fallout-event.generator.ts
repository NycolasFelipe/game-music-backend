import { ACTIVE_EVENT_TEMPLATES } from "@/modules/events/domain/data/active-event-templates";
import { instantiateActiveEvent } from "@/modules/events/domain/generation/active-event.generator";
import type {
  EventCharacter,
  GeneratedActiveEvent,
} from "@/modules/events/domain/generation/generated-active-event";

/** Templates reachable only when a confraternização goes wrong (ADR-0017 §3). */
const FALLOUT_TEMPLATES = ACTIVE_EVENT_TEMPLATES.filter(
  (template) => template.type === "confraternizacao",
);

/**
 * Raises the decision that a night out left behind. Unlike the regular
 * generator, the cast is not searched for — the caller already knows which two
 * people were in the room when it went sideways.
 *
 * @param params - The band's live year and the pair the trouble fell on.
 * @returns The generated (pending) event, or `null` when no template fits.
 */
export function generateFalloutEvent(params: {
  year: number;
  pair: [EventCharacter, EventCharacter];
}): GeneratedActiveEvent | null {
  if (FALLOUT_TEMPLATES.length === 0) return null;

  const index = Math.floor(Math.random() * FALLOUT_TEMPLATES.length);
  const template = FALLOUT_TEMPLATES[index];

  return instantiateActiveEvent(template, params.pair, params.year);
}
