import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { ActivityOptionsView } from "@/modules/activities/application/dto/activity-option.view";
import {
  activityCost,
  saturationFactor,
} from "@/modules/activities/domain/activity/activity.calculator";
import {
  ACTIVITY_HOSTILITY_RISK,
  ACTIVITY_TROUBLE_CHANCE_MAX,
} from "@/modules/activities/domain/constants/activity.constant";
import { ACTIVITIES } from "@/modules/activities/domain/data/activities";
import {
  BAND_ACTIVITIES_REPOSITORY,
  type BandActivitiesRepository,
} from "@/modules/activities/domain/repositories/band-activities.repository";
import { calculateFameLevel } from "@/modules/bands/domain/fame/fame.calculator";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Lists the activities on offer, already priced for this band. The price table
 * is computed here so the client never re-implements the cost rule (ADR-0017 §1)
 * and can never quote a number the server would reject.
 */
@Injectable()
export class ListActivityOptionsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_ACTIVITIES_REPOSITORY)
    private readonly activitiesRepository: BandActivitiesRepository,
  ) {}

  /**
   * Prices the catalog for a band the actor owns.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @returns The priced catalog plus this turn's effect multiplier.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<ActivityOptionsView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const heldThisTurn = await this.activitiesRepository.countByBandAndYear(
      bandId,
      band.currentYear,
    );
    const fameLevel = calculateFameLevel(band.fanCount);

    return {
      heldThisTurn,
      nextSaturation: saturationFactor(heldThisTurn),
      hostilityRisk: ACTIVITY_HOSTILITY_RISK,
      troubleChanceMax: ACTIVITY_TROUBLE_CHANCE_MAX,
      activities: ACTIVITIES.map((activity) => {
        const costs: Array<{ participants: number; cost: number }> = [];
        for (
          let size = activity.minParticipants;
          size <= activity.maxParticipants;
          size += 1
        ) {
          costs.push({
            participants: size,
            cost: activityCost(activity, size, fameLevel),
          });
        }

        return {
          id: activity.id,
          label: activity.label,
          description: activity.description,
          emoji: activity.emoji,
          minParticipants: activity.minParticipants,
          maxParticipants: activity.maxParticipants,
          happinessGain: activity.happinessGain,
          relationshipGain: activity.relationshipGain,
          troubleChance: activity.troubleChance,
          costs,
        };
      }),
    };
  }
}
