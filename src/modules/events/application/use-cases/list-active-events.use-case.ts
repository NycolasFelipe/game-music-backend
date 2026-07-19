import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { toActiveEventView } from "@/modules/events/application/mappers/active-event.mapper";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";

/**
 * Lists a band's active events.
 */
@Injectable()
export class ListActiveEventsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
  ) {}

  /**
   * Verifies band ownership and returns the band's events.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's events as public views.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<ActiveEventView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const events = await this.activeEventsRepository.findByBandId(bandId);
    return events.map(toActiveEventView);
  }
}
