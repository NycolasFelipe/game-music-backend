import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { GigView } from "@/modules/gigs/application/dto/gig.view";
import { toGigView } from "@/modules/gigs/application/mappers/gig.mapper";
import {
  GIGS_REPOSITORY,
  type GigsRepository,
} from "@/modules/gigs/domain/repositories/gigs.repository";

/** Lists the live seasons a band has played (ADR-0016), newest first. */
@Injectable()
export class ListGigsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(GIGS_REPOSITORY)
    private readonly gigsRepository: GigsRepository,
  ) {}

  /**
   * Lists the band's gig history, scoped to its owner.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @returns The band's played seasons, newest first.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<GigView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const gigs = await this.gigsRepository.findByBandId(bandId);
    return gigs.map(toGigView);
  }
}
