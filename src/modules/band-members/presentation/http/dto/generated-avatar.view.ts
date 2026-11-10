import type { MemberAppearance } from "@/modules/band-members/domain/constants/appearance.constant";

/** A regenerated avatar and the look that goes with it (ADR-0023). */
export class GeneratedAvatarView {
  /** Person emoji: gender, skin tone and hair. */
  avatar: string;
  /** Hair style, beard, glasses, earring and shirt, consistent with the emoji. */
  appearance: MemberAppearance;
}
