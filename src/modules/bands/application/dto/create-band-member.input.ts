import type { MemberAppearance } from "@/modules/band-members/domain/constants/appearance.constant";
import type { CreateBandMemberSeed } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * A founding member as the application receives it. `appearance` is optional
 * so older clients keep working: the use case generates it when missing
 * (ADR-0023).
 */
export type CreateBandMemberInput = Omit<CreateBandMemberSeed, "appearance"> & {
  appearance?: MemberAppearance;
};
