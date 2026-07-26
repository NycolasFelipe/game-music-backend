import { GigView } from "@/modules/gigs/application/dto/gig.view";
import type { GigEntity } from "@/modules/gigs/domain/entities/gig.entity";

/**
 * Maps a gig domain entity to its public view, deriving the net result.
 *
 * @param gig - The gig domain entity.
 * @returns The gig view.
 */
export function toGigView(gig: GigEntity): GigView {
  return {
    id: gig.id,
    bandId: gig.bandId,
    gigTypeId: gig.gigTypeId,
    playedAtYear: gig.playedAtYear,
    fee: gig.fee,
    cost: gig.cost,
    net: Math.round((gig.fee - gig.cost) * 100) / 100,
    fansGained: gig.fansGained,
    performance: gig.performance,
    happinessDelta: gig.happinessDelta,
    createdAt: gig.createdAt,
  };
}
