import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { toActiveEventView } from "@/modules/events/application/mappers/active-event.mapper";
import { generateActiveEvent } from "@/modules/events/domain/generation/active-event.generator";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";

/**
 * Generates and persists one eligible active event for a band at a given year.
 */
@Injectable()
export class GenerateActiveEventUseCase {
  private readonly logger = new Logger(GenerateActiveEventUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
  ) {}

  /**
   * Loads the band state, generates an eligible event the band has never seen
   * and persists it (ADR-0031). The cast spreads across the band: whoever was
   * in the previous event weighs less (ADR-0028).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param year - The current year used for eligibility.
   * @returns The generated (pending) event as a public view.
   * @throws {NotFoundException} When the band is not found, or no eligible
   * event could be generated.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    year: number,
  ): Promise<ActiveEventView> {
    const band = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    // No template repeats within a save (ADR-0031 §1): once the catalog for
    // the band's state runs out, the semester simply has no event (§4).
    const used = await this.activeEventsRepository.usedTemplateIds(bandId);
    // Most recent first: whoever was in the last event weighs less (ADR-0028).
    const [lastEvent] = await this.activeEventsRepository.findByBandId(bandId);

    const generated = generateActiveEvent({
      year,
      characters: band.members.map((m) => ({
        id: m.id,
        name: m.name,
        characteristics: m.characteristics,
        gender: m.gender,
      })),
      relationships: band.relationships.map((r) => ({
        memberAId: r.memberAId,
        memberBId: r.memberBId,
        level: r.level,
      })),
      fanCount: band.band.fanCount,
      recentTemplateIds: new Set(used),
      lastInvolvedIds: lastEvent?.involvedCharacterIds ?? [],
    });

    if (!generated) {
      throw new NotFoundException(
        "No eligible event could be generated for this band",
      );
    }

    const created = await this.activeEventsRepository.create({
      bandId,
      templateId: generated.templateId,
      year: generated.year,
      type: generated.type,
      title: generated.title,
      description: generated.description,
      involvedCharacterIds: generated.involvedCharacterIds,
      options: generated.options,
    });

    this.logger.log(
      `Generated event "${created.templateId}" for band ${bandId} (year ${year})`,
    );

    return toActiveEventView(created);
  }
}
