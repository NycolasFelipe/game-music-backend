import type {
  ReleaseCreationLogEntry,
  ReleaseCredits,
  ReleaseDetails,
  ReleaseStatus,
} from "@/modules/releases/domain/constants/release.constant";

/**
 * Public view of a release returned to clients. Outcome fields are `null` while
 * the work is still a draft (`em_criacao`).
 */
export class ReleaseView {
  id: string;
  bandId: string;
  title: string;
  concept: string;
  format: string;
  style: string;
  budgetTier: string;
  status: ReleaseStatus;
  credits: ReleaseCredits;
  quality: number | null;
  qualityTier: string | null;
  fansGained: number | null;
  cost: number | null;
  masterRevenueTotal: number | null;
  publishingRevenueTotal: number | null;
  royaltyRemaining: number;
  royaltyTurnsLeft: number;
  releasedAtYear: number | null;
  creationLog: ReleaseCreationLogEntry[];
  details: ReleaseDetails | null;
  createdAt: Date;
}
