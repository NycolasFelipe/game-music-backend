import { GigView } from "@/modules/gigs/application/dto/gig.view";

/** What a played season changed in the band, for the post-show summary. */
export class GigResultView {
  /** The recorded season. */
  gig: GigView;
  /** The band's cash after the season. */
  balance: number;
  /** The band's fan count after the season. */
  fanCount: number;
  /** Members whose stage skill grew on the road (ADR-0016 §5). */
  skillGains: Array<{
    memberId: string;
    name: string;
    skill: string;
    from: number;
    to: number;
  }>;
}
