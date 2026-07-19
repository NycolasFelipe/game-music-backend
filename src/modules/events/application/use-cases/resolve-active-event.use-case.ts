import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { computeFameProgress } from "@/modules/bands/domain/fame/fame.calculator";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { EventResolutionView } from "@/modules/events/application/dto/event-resolution.view";
import { toActiveEventView } from "@/modules/events/application/mappers/active-event.mapper";
import {
  computeBandStateChanges,
  rollConsequence,
} from "@/modules/events/domain/generation/consequence-resolver";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";

/**
 * Resolves an active event: rolls the chosen option's consequence, applies it
 * to the band (fan count, member happiness, relationships) atomically, and
 * marks the event resolved.
 */
@Injectable()
export class ResolveActiveEventUseCase {
  private readonly logger = new Logger(ResolveActiveEventUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
  ) {}

  /**
   * Applies the chosen option's consequence and resolves the event.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param eventId - The event id.
   * @param optionId - The id of the chosen option.
   * @returns The resolved event, the rolled outcome and the applied changes.
   * @throws {NotFoundException} When the band, event or option is not found.
   * @throws {ConflictException} When the event was already resolved.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    eventId: string,
    optionId: string,
  ): Promise<EventResolutionView> {
    const band = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
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
    if (event.resolved) {
      throw new ConflictException("Event already resolved");
    }

    const option = event.options.find((o) => o.id === optionId);
    if (!option) {
      throw new NotFoundException("Option not found");
    }

    const outcome = rollConsequence(option.consequence);

    const applied = computeBandStateChanges({
      eventType: event.type,
      consequence: outcome,
      involvedCharacterIds: event.involvedCharacterIds,
      currentFanCount: band.band.fanCount,
      members: band.members.map((m) => ({ id: m.id, happiness: m.happiness })),
      relationships: band.relationships.map((r) => ({
        memberAId: r.memberAId,
        memberBId: r.memberBId,
        level: r.level,
      })),
    });

    await this.bandsRepository.applyBandStateChanges(bandId, applied);

    const fameChange = computeFameProgress(
      band.band.fanCount,
      applied.fanCount,
    );

    const resolved = await this.activeEventsRepository.markResolved(
      eventId,
      bandId,
      optionId,
      outcome,
    );

    this.logger.log(
      `Resolved event ${eventId} (option ${optionId}) for band ${bandId}` +
        (fameChange.leveledUp
          ? ` — fame up to level ${fameChange.newLevel} "${fameChange.milestones.at(-1)?.title}"`
          : ""),
    );

    return {
      event: toActiveEventView(resolved ?? event),
      outcome,
      applied,
      fameChange,
    };
  }
}
