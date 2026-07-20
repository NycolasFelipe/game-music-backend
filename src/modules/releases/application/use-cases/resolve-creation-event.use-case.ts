import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import type { CreationEventEffect } from "@/modules/releases/domain/types/creation-event";

/**
 * Resolves one creation event of a draft: applies the chosen option's effect
 * (rolling the odds for a gamble), records it, and returns the release with its
 * updated events. The work is finalizable once no events remain pending.
 */
@Injectable()
export class ResolveCreationEventUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Resolves a creation event by choosing one of its options.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band the release belongs to.
   * @param releaseId - The draft the event belongs to.
   * @param eventId - The creation event to resolve.
   * @param optionId - The chosen option id.
   * @returns The release with its updated creation events.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    releaseId: string,
    eventId: string,
    optionId: string,
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

    const events =
      await this.releasesRepository.findCreationEventsByRelease(releaseId);
    return toReleaseWithEventsView(release, events);
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
