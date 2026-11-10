import type { GigMemberInput } from "@/modules/gigs/domain/gig/gig.calculator";

/** The band state a gig preview is computed from (ADR-0022). */
export class PreviewGigsInput {
  /** The band's current fan count (its draw and its fame level). */
  fanCount: number;
  /** The band's current members (skills and happiness). */
  members: GigMemberInput[];
}
