import { Injectable } from "@nestjs/common";
import type { GigPreviewView } from "@/modules/gigs/application/dto/gig-preview.view";
import type { GigPreviewsView } from "@/modules/gigs/application/dto/gig-previews.view";
import type { PreviewGigsInput } from "@/modules/gigs/application/dto/preview-gigs.input";
import { calculateFameLevel } from "@/modules/bands/domain/fame/fame.calculator";
import { GIG_TYPES } from "@/modules/gigs/domain/data/gig-types";
import { evaluateGig } from "@/modules/gigs/domain/gig/gig.calculator";

/**
 * Previews a live season on every circuit with the band as it is now
 * (ADR-0022). Uses the same calculator as {@link PlayGigUseCase} with a neutral
 * variance, so the numbers are the centre of what a real season can give.
 * Writes nothing.
 */
@Injectable()
export class PreviewGigsUseCase {
  /**
   * Computes the band's expected stage performance and one season preview per
   * circuit of the catalog.
   *
   * Flow: derives the fame level from the fan count; for each circuit runs
   * `evaluateGig` with variance 1 and marks whether the fame level books it.
   * Cash is not checked here: the caller compares `cost` with the balance.
   *
   * @param input - The band's fan count and members.
   * @returns The expected performance and the previews, in catalog order.
   */
  execute(input: PreviewGigsInput): GigPreviewsView {
    const fameLevel = calculateFameLevel(input.fanCount);
    let performance = 0;

    const previews: GigPreviewView[] = GIG_TYPES.map((gigType) => {
      const evaluation = evaluateGig({
        gigType,
        members: input.members,
        currentFans: input.fanCount,
        variance: 1,
      });
      performance = evaluation.performance;
      return {
        gigTypeId: gigType.id,
        label: gigType.label,
        minFameLevel: gigType.minFameLevel,
        available: fameLevel >= gigType.minFameLevel,
        expectedPerformance: gigType.expectedPerformance,
        fee: evaluation.fee,
        cost: evaluation.cost,
        net: evaluation.net,
        fansGained: evaluation.fansGained,
        happinessDelta: evaluation.happinessDelta,
      };
    });

    return { performance, previews };
  }
}
