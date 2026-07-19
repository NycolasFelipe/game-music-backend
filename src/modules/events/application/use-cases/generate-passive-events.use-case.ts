import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";
import { toPassiveEventView } from "@/modules/events/application/mappers/passive-event.mapper";
import { generatePassiveEvent } from "@/modules/events/domain/generation/passive-event.generator";
import type { RecentPassiveEvent } from "@/modules/events/domain/generation/generated-passive-event";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import type {
  CreatePassiveEventData,
  PassiveEventsRepository,
} from "@/modules/events/domain/repositories/passive-events.repository";

/** Year window used to avoid repeating recent passive events. */
const RECENT_EVENT_WINDOW = 3;

/**
 * Generates and persists passive (timeline) events for a band at a given year.
 */
@Injectable()
export class GeneratePassiveEventsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(PASSIVE_EVENTS_REPOSITORY)
    private readonly passiveEventsRepository: PassiveEventsRepository,
  ) {}

  /**
   * Verifies band ownership, generates up to `count` fresh passive events
   * (avoiding recent repeats) and persists them.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param year - The current year used for artist eligibility.
   * @param count - How many events to generate.
   * @returns The persisted passive events as public views.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    year: number,
    count: number,
  ): Promise<PassiveEventView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const recent: RecentPassiveEvent[] =
      await this.passiveEventsRepository.recentEvents(
        bandId,
        year,
        RECENT_EVENT_WINDOW,
      );

    const toCreate: CreatePassiveEventData[] = [];
    for (let i = 0; i < count; i++) {
      const generated = generatePassiveEvent(year, recent);
      if (!generated) {
        continue;
      }
      recent.push({
        templateId: generated.templateId,
        artists: generated.artists,
      });
      toCreate.push({ bandId, ...generated });
    }

    const created = await this.passiveEventsRepository.createMany(toCreate);
    return created.map(toPassiveEventView);
  }
}
