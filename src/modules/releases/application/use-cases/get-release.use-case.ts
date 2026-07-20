import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { ReleaseWithEventsView } from "@/modules/releases/application/dto/release-with-events.view";
import { toReleaseWithEventsView } from "@/modules/releases/application/mappers/creation-event.mapper";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Fetches one release (with its creation events) scoped to the owner. Used by
 * the creation flow to load a draft and its pending decisions.
 */
@Injectable()
export class GetReleaseUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Fetches a release with its creation events.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band the release belongs to.
   * @param releaseId - The release id.
   * @returns The release composed with its creation events.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    releaseId: string,
  ): Promise<ReleaseWithEventsView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found for this owner.");
    }
    const release = await this.releasesRepository.findByIdAndBand(
      releaseId,
      bandId,
    );
    if (!release) {
      throw new NotFoundException("Release not found for this band.");
    }
    const events =
      await this.releasesRepository.findCreationEventsByRelease(releaseId);
    return toReleaseWithEventsView(release, events);
  }
}
