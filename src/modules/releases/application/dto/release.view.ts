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
  /** Critic reception score 0..100 (`null` for drafts / legacy works). */
  criticScore: number | null;
  /** Public reception score 0..100 (`null` for drafts / legacy works). */
  publicScore: number | null;
  /** Critic review tier id, derived from `criticScore` (`null` when no score). */
  criticTier: string | null;
  /** Public review tier id, derived from `publicScore` (`null` when no score). */
  publicTier: string | null;
  /** Three specialized-critic blurbs (empty when no score). */
  criticComments: string[];
  /** Three public (fan) blurbs (empty when no score). */
  publicComments: string[];
  /** A format-specific editorial note (`null` when no score / no note). */
  formatComment: string | null;
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
