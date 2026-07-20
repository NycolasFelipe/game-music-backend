import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import { toReleaseView } from "@/modules/releases/application/mappers/release.mapper";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Lists a band's releases (its discography), scoped to the owner.
 */
@Injectable()
export class ListReleasesUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Lists the band's releases.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band whose discography to list.
   * @returns The band's releases (newest first).
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<ReleaseView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found for this owner.");
    }
    const releases = await this.releasesRepository.findByBandId(bandId);
    return releases.map(toReleaseView);
  }
}
