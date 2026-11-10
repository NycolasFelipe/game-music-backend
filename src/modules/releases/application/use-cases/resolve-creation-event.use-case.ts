import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { ReleaseWithEventsView } from "@/modules/releases/application/dto/release-with-events.view";
import { toReleaseWithEventsView } from "@/modules/releases/application/mappers/creation-event.mapper";
import { resolveCreationCost } from "@/modules/releases/domain/creation/creation-cost.calculator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";
import type { CreationEventEffect } from "@/modules/releases/domain/types/creation-event";

/**
 * Resolves one creation event of a draft: applies the chosen option's effect
 * (rolling the odds for a gamble), charges the option's side cost (ADR-0019),
 * records it, and returns the release with its updated events. The work is
 * finalizable once no events remain pending.
 */
@Injectable()
export class ResolveCreationEventUseCase {
  private readonly logger = new Logger(ResolveCreationEventUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Resolves a creation event by choosing one of its options.
   *
   * Flow: validates ownership, the draft and the pending event; rolls the
   * option's quality effect and records it; then charges the option's side cost
   * (ADR-0019) — extra production turns go to the draft, happiness and
   * relationship changes go to the band. Members who left since the session
   * opened are skipped. When the production got longer, the draft is reloaded
   * so the returned view shows the new turn count.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band the release belongs to.
   * @param releaseId - The draft the event belongs to.
   * @param eventId - The creation event to resolve.
   * @param optionId - The chosen option id.
   * @returns The release with its updated creation events.
   * @throws NotFoundException when the band, release or event is not found.
   * @throws ConflictException when the release was launched or the event was
   *   already resolved.
   * @throws BadRequestException when the option does not exist.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    releaseId: string,
    eventId: string,
    optionId: string,
  ): Promise<ReleaseWithEventsView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!composed) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const release = await this.releasesRepository.findByIdAndBand(
      releaseId,
      bandId,
    );
    if (!release) {
      throw new NotFoundException("Release not found for this band.");
    }
    if (release.status !== "em_criacao") {
      throw new ConflictException("This release has already been launched.");
    }

    const event = await this.releasesRepository.findCreationEvent(
      eventId,
      releaseId,
    );
    if (!event) {
      throw new NotFoundException("Creation event not found for this release.");
    }
    if (event.resolved) {
      throw new ConflictException("This creation event was already resolved.");
    }

    const option = event.options.find((o) => o.id === optionId);
    if (!option) {
      throw new BadRequestException(`Unknown option: ${optionId}`);
    }

    const qualityModifier = this.resolveEffect(option.effect);
    await this.releasesRepository.resolveCreationEvent(eventId, {
      chosenOptionId: optionId,
      qualityModifier,
    });

    const outcome = resolveCreationCost(
      option.cost,
      composed.members.map((member) => ({
        id: member.id,
        happiness: member.happiness,
      })),
      composed.relationships,
    );
    if (outcome.extraProductionTurns > 0) {
      await this.releasesRepository.setProductionTurnsLeft(
        releaseId,
        release.productionTurnsLeft + outcome.extraProductionTurns,
      );
    }
    if (
      outcome.memberHappiness.length > 0 ||
      outcome.relationshipLevels.length > 0
    ) {
      await this.bandsRepository.applyBandStateChanges(bandId, {
        memberHappiness: outcome.memberHappiness,
        relationshipLevels: outcome.relationshipLevels,
      });
    }

    this.logger.log(
      `Resolved creation event ${eventId} of release ${releaseId} with ` +
        `"${optionId}" (×${qualityModifier})` +
        `${outcome.extraProductionTurns ? ` — +${outcome.extraProductionTurns} production turn(s)` : ""}` +
        `${outcome.memberHappiness.length ? ` — ${outcome.memberHappiness.length} member(s) overruled` : ""}` +
        `${outcome.relationshipLevels.length ? ` — ${outcome.relationshipLevels.length} relationship(s) soured` : ""}.`,
    );

    const current =
      outcome.extraProductionTurns > 0
        ? ((await this.releasesRepository.findByIdAndBand(releaseId, bandId)) ??
          release)
        : release;
    const events =
      await this.releasesRepository.findCreationEventsByRelease(releaseId);
    return toReleaseWithEventsView(current, events);
  }

  /**
   * Resolves an option effect into a concrete quality modifier, rolling the
   * odds for a probabilistic (gamble) effect.
   *
   * @param effect - The chosen option's effect.
   * @returns The quality modifier (rounded to 3 decimals).
   */
  private resolveEffect(effect: CreationEventEffect): number {
    const modifier =
      effect.type === "fixed"
        ? effect.qualityModifier
        : Math.random() < effect.successChance
          ? effect.successModifier
          : effect.failureModifier;
    return Math.round(modifier * 1000) / 1000;
  }
}
