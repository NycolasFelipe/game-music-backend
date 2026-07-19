import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";
import { toPassiveEventView } from "@/modules/events/application/mappers/passive-event.mapper";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import type { PassiveEventsRepository } from "@/modules/events/domain/repositories/passive-events.repository";

/**
 * Lists a band's passive (timeline) events.
 */
@Injectable()
export class ListPassiveEventsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(PASSIVE_EVENTS_REPOSITORY)
    private readonly passiveEventsRepository: PassiveEventsRepository,
  ) {}

  /**
   * Verifies band ownership and returns the band's passive events.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's passive events as public views.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<PassiveEventView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const events = await this.passiveEventsRepository.findByBandId(bandId);
    return events.map(toPassiveEventView);
  }
}
