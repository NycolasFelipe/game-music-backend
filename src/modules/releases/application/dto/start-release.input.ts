import type { ReleaseCredits } from "@/modules/releases/domain/constants/release.constant";

/** Application input to start a release draft (validated HTTP DTO maps into this). */
export interface StartReleaseInput {
  title: string;
  concept: string;
  style: string;
  format: string;
  budgetTier: string;
  credits: ReleaseCredits;
}
