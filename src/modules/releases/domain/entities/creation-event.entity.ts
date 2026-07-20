import type {
  CreationEventKind,
  CreationEventOption,
} from "@/modules/releases/domain/types/creation-event";

/**
 * Domain representation of a creation event tied to a release draft. Anemic by
 * design; the resolution logic lives in the resolve use-case.
 */
export class CreationEventEntity {
  constructor(
    public readonly id: string,
    public readonly releaseId: string,
    public readonly sequence: number,
    public readonly kind: CreationEventKind,
    public readonly prompt: string,
    public readonly options: CreationEventOption[],
    public readonly resolved: boolean,
    public readonly chosenOptionId: string | null,
    /** Quality modifier the resolution produced (null until resolved). */
    public readonly qualityModifier: number | null,
    public readonly createdAt: Date,
  ) {}
}
