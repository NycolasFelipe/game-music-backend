import type { CreationEventKind } from "@/modules/releases/domain/types/creation-event";

/** A creation-event option as shown to the client (odds are hidden). */
export class CreationEventOptionView {
  id: string;
  label: string;
  description: string;
}

/** Public view of a creation event. The option effects are never exposed. */
export class CreationEventView {
  id: string;
  sequence: number;
  kind: CreationEventKind;
  prompt: string;
  options: CreationEventOptionView[];
  resolved: boolean;
  chosenOptionId: string | null;
  qualityModifier: number | null;
}
