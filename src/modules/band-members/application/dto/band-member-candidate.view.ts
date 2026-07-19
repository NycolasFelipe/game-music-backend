import type { GeneratedBandMember } from "@/modules/band-members/domain/generation/generated-band-member";

/**
 * A generated member candidate returned to the client. The `id` is a temporary
 * identifier for UI keying only — candidates are not persisted.
 */
export interface BandMemberCandidateView extends GeneratedBandMember {
  id: string;
}
