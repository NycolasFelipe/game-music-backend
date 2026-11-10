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
 * Picks the fallout template for a band: one it has never received, at random;
 * once it has seen them all, the one it saw longest ago. With only a handful
 * of templates, this keeps the same night from replaying while others wait.
 *
 * @param usedTemplateIds - Template ids of the band's events, most recent first.
 * @returns The chosen template, or `undefined` when the catalog is empty.
 */
function pickFalloutTemplate(usedTemplateIds: readonly string[]) {
  const fresh = FALLOUT_TEMPLATES.filter(
    (template) => !usedTemplateIds.includes(template.id),
  );
  if (fresh.length > 0) {
    return fresh[Math.floor(Math.random() * fresh.length)];
  }
  return FALLOUT_TEMPLATES.reduce((oldest, template) =>
    usedTemplateIds.indexOf(template.id) > usedTemplateIds.indexOf(oldest.id)
      ? template
      : oldest,
  );
}

/**
 * Raises the decision that a night out left behind. Unlike the regular
 * generator, the cast is not searched for — the caller already knows which two
 * people were in the room when it went sideways.
 *
 * @param params - The band's live year, the pair the trouble fell on and the
 *   template ids of the band's past events (most recent first), so the same
 *   trouble does not come back while another one is still unseen.
 * @returns The generated (pending) event, or `null` when no template fits.
 */
export function generateFalloutEvent(params: {
  year: number;
  pair: [EventCharacter, EventCharacter];
  usedTemplateIds?: readonly string[];
}): GeneratedActiveEvent | null {
  if (FALLOUT_TEMPLATES.length === 0) return null;

  const template = pickFalloutTemplate(params.usedTemplateIds ?? []);
  return instantiateActiveEvent(template, params.pair, params.year);
}
