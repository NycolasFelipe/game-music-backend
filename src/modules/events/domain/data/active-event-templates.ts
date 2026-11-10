import { ACTIVITY_FALLOUT_TEMPLATES } from "@/modules/events/domain/data/active-events/activity-fallout.templates";
import { CASAS_TEMPLATES } from "@/modules/events/domain/data/active-events/casas.templates";
import { NACIONAL_TEMPLATES } from "@/modules/events/domain/data/active-events/nacional.templates";
import { PORTED_TEMPLATES } from "@/modules/events/domain/data/active-events/ported.templates";
import type { ActiveEventTemplate } from "@/modules/events/domain/types/active-event-template";

/**
 * Static catalog of active-event templates. Content only — no logic. Each
 * group lives in its own file under `active-events/`, one per fame phase
 * (ADR-0025) plus the ported originals and the activity fallout.
 */
export const ACTIVE_EVENT_TEMPLATES: ActiveEventTemplate[] = [
  ...PORTED_TEMPLATES,
  ...CASAS_TEMPLATES,
  ...NACIONAL_TEMPLATES,
  ...ACTIVITY_FALLOUT_TEMPLATES,
];
