import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandActivityView } from "@/modules/activities/application/dto/band-activity.view";
import { toBandActivityView } from "@/modules/activities/application/mappers/activity.mapper";
import {
  BAND_ACTIVITIES_REPOSITORY,
  type BandActivitiesRepository,
} from "@/modules/activities/domain/repositories/band-activities.repository";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";

/** Lists the activities a band has held, newest first (ADR-0017 §5). */
@Injectable()
export class ListBandActivitiesUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_ACTIVITIES_REPOSITORY)
    private readonly activitiesRepository: BandActivitiesRepository,
  ) {}

  /**
   * Lists a band's activity history.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @returns The band's activities, newest first.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<BandActivityView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const activities = await this.activitiesRepository.findByBandId(bandId);
    return activities.map(toBandActivityView);
  }
}
