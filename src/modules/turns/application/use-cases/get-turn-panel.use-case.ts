import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import {
  ACTIVE_EVENTS_REPOSITORY,
  type ActiveEventsRepository,
} from "@/modules/events/domain/repositories/active-events.repository";
import {
  BAND_ACTIVITIES_REPOSITORY,
  type BandActivitiesRepository,
} from "@/modules/activities/domain/repositories/band-activities.repository";
import { toGigView } from "@/modules/gigs/application/mappers/gig.mapper";
import { PreviewGigsUseCase } from "@/modules/gigs/application/use-cases/preview-gigs.use-case";
import {
  GIGS_REPOSITORY,
  type GigsRepository,
} from "@/modules/gigs/domain/repositories/gigs.repository";
import { SATURATION_FACTORS } from "@/modules/releases/domain/constants/release.constant";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";
import type { TurnPanelView } from "@/modules/turns/application/dto/turn-panel.view";
import type { TurnPendingItemView } from "@/modules/turns/application/dto/turn-pending-item.view";
import { formatPeriod } from "@/modules/turns/application/mappers/turn.mapper";
import { ForecastTurnUseCase } from "@/modules/turns/application/use-cases/forecast-turn.use-case";

/**
 * Reads everything the turn screen needs in one call (ADR-0022): what waits
 * on the player, the live season, the get-together slot, the studio and the
 * forecast of the next advance. Writes nothing.
 */
@Injectable()
export class GetTurnPanelUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
    @Inject(GIGS_REPOSITORY)
    private readonly gigsRepository: GigsRepository,
    @Inject(BAND_ACTIVITIES_REPOSITORY)
    private readonly activitiesRepository: BandActivitiesRepository,
    private readonly previewGigs: PreviewGigsUseCase,
    private readonly forecastTurn: ForecastTurnUseCase,
  ) {}

  /**
   * Builds the turn panel of a band the actor owns.
   *
   * Flow: loads the band with its members (404 when it is not the actor's);
   * reads the unresolved active events, the work in creation and its pending
   * studio sessions, the seasons played, the get-together count of the
   * semester and the works launched this calendar year; previews every live
   * circuit ({@link PreviewGigsUseCase}) and forecasts the advance
   * ({@link ForecastTurnUseCase}).
   *
   * Pending items come in this order: active events, studio sessions, then the
   * work ready to launch. A work is ready when its production is over and no
   * session is pending (the same rule the launch enforces).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The turn panel.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<TurnPanelView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!composed) {
      throw new NotFoundException("Band not found for this owner.");
    }
    const { band, members } = composed;

    const [activeEvents, draft, gigs, activitiesHeld, launchesThisYear] =
      await Promise.all([
        this.activeEventsRepository.findByBandId(bandId),
        this.releasesRepository.findInCreation(bandId),
        this.gigsRepository.findByBandId(bandId),
        this.activitiesRepository.countByBandAndYear(bandId, band.currentYear),
        this.releasesRepository.countLaunchedInYear(
          bandId,
          Math.floor(band.currentYear),
        ),
      ]);

    const sessions = draft
      ? (
          await this.releasesRepository.findCreationEventsByRelease(draft.id)
        ).filter((event) => !event.resolved)
      : [];
    const ready =
      !!draft && draft.productionTurnsLeft <= 0 && sessions.length === 0;

    const pending: TurnPendingItemView[] = [
      ...activeEvents
        .filter((event) => !event.resolved)
        .map((event) => ({
          kind: "active-event" as const,
          id: event.id,
          releaseId: null,
          title: event.title,
          blocking: true,
        })),
      ...sessions.map((session) => ({
        kind: "studio-session" as const,
        id: session.id,
        releaseId: session.releaseId,
        title: session.prompt,
        blocking: true,
      })),
      ...(draft && ready
        ? [
            {
              kind: "release-ready" as const,
              id: draft.id,
              releaseId: draft.id,
              title: draft.title,
              blocking: false,
            },
          ]
        : []),
    ];

    const played = gigs.find((gig) => gig.playedAtYear === band.currentYear);
    const { performance, previews } = this.previewGigs.execute({
      fanCount: band.fanCount,
      members: members.map((member) => ({
        id: member.id,
        skills: member.skills,
        happiness: member.happiness,
      })),
    });

    const forecast = await this.forecastTurn.execute({
      bandId,
      balance: band.balance,
      fanCount: band.fanCount,
      autoSalaryAdjust: band.autoSalaryAdjust,
      members,
    });

    return {
      year: band.currentYear,
      period: formatPeriod(bandId, band.currentYear),
      performance,
      pending,
      gig: {
        playedThisTurn: played ? toGigView(played) : null,
        previews,
      },
      activity: { heldThisTurn: activitiesHeld > 0 },
      studio: {
        release: draft
          ? {
              id: draft.id,
              title: draft.title,
              format: draft.format,
              turnsLeft: draft.productionTurnsLeft,
              ready,
            }
          : null,
        launchesThisYear,
        nextMarketMultiplier:
          SATURATION_FACTORS[
            Math.min(launchesThisYear, SATURATION_FACTORS.length - 1)
          ],
      },
      forecast,
    };
  }
}
