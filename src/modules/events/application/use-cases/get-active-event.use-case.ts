import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { toActiveEventView } from "@/modules/events/application/mappers/active-event.mapper";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";

/**
 * Fetches a single active event of a band.
 */
@Injectable()
export class GetActiveEventUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
  ) {}

  /**
   * Verifies band ownership and returns the requested event.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param eventId - The event id.
   * @returns The event as a public view.
   * @throws {NotFoundException} When the band or event is not found.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    eventId: string,
  ): Promise<ActiveEventView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const event = await this.activeEventsRepository.findByIdAndBandId(
      eventId,
      bandId,
    );
    if (!event) {
      throw new NotFoundException("Event not found");
    }

    return toActiveEventView(event);
  }
}
