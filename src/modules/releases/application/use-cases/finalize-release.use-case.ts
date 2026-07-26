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
import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import { toReleaseView } from "@/modules/releases/application/mappers/release.mapper";
import {
  QUALITY_VARIANCE,
  ROYALTY_WINDOW_TURNS,
  SATURATION_FACTORS,
} from "@/modules/releases/domain/constants/release.constant";
import { findBudgetTier } from "@/modules/releases/domain/data/budget-tiers";
import { findReleaseFormat } from "@/modules/releases/domain/data/release-formats";
import { genreProfileFor } from "@/modules/releases/domain/data/release-genre-profiles";
import { evaluateMemberGrowth } from "@/modules/releases/domain/growth/growth.calculator";
import { evaluateRelease } from "@/modules/releases/domain/quality/release.calculator";
import { evaluateReviews } from "@/modules/releases/domain/quality/review.calculator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Finalizes (launches) a release draft: computes its quality and economics,
 * debits the production cost and credits the fans gained (fame recomputes from
 * fans). No revenue enters on launch (`UPFRONT_FRACTION = 0`) — the whole revenue
 * is the royalty tail, which only starts arriving on the next `AdvanceTurn`.
 * The credited members also develop (skills + pride, ADR-0012). Atomic
 * band-state change via `applyBandStateChanges`.
 */
@Injectable()
export class FinalizeReleaseUseCase {
  private readonly logger = new Logger(FinalizeReleaseUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Finalizes a draft into a launched work.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band the release belongs to.
   * @param releaseId - The draft to finalize.
   * @returns The launched release view.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    releaseId: string,
  ): Promise<ReleaseView> {
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
    if (release.productionTurnsLeft > 0) {
      throw new ConflictException(
        `This release is still in production (${release.productionTurnsLeft} turn(s) left).`,
      );
    }

    const format = findReleaseFormat(release.format);
    const budgetTier = findBudgetTier(release.budgetTier);
    if (!format || !budgetTier) {
      throw new BadRequestException("This release has invalid format/budget.");
    }

    const events =
      await this.releasesRepository.findCreationEventsByRelease(releaseId);
    const pending = events.filter((e) => !e.resolved);
    if (pending.length > 0) {
      throw new ConflictException(
        "Resolve the pending creation events before finalizing.",
      );
    }

    const creationLog = events.map((event) => ({
      eventId: event.id,
      prompt: event.prompt,
      choiceLabel:
        event.options.find((o) => o.id === event.chosenOptionId)?.label ?? "",
      qualityModifier: event.qualityModifier ?? 1,
    }));
    const eventModifier = creationLog.reduce(
      (product, entry) => product * (entry.qualityModifier || 1),
      1,
    );

    const members = composed.members.map((m) => ({
      id: m.id,
      skills: m.skills,
      happiness: m.happiness,
    }));

    const variance = 1 + (Math.random() * 2 - 1) * QUALITY_VARIANCE;

    // How crowded this release year already is: each extra work sells to a more
    // tired audience (ADR-0015 §5).
    const launchedThisYear = await this.releasesRepository.countLaunchedInYear(
      bandId,
      Math.floor(composed.band.currentYear),
    );
    const saturation =
      SATURATION_FACTORS[
        Math.min(launchedThisYear, SATURATION_FACTORS.length - 1)
      ];

    const evaluation = evaluateRelease({
      format,
      budgetTier,
      genreProfile: genreProfileFor(release.style),
      credits: release.credits,
      members,
      currentFans: composed.band.fanCount,
      relationships: composed.relationships,
      saturation,
      eventModifier,
      variance,
    });

    // Critic and public reception scores (ADR-0011) — informational; they do not
    // change fans/revenue, which still come from the quality tier.
    const reviews = evaluateReviews({
      quality: evaluation.quality,
      formatId: format.id,
      budgetTierId: budgetTier.id,
      style: release.style,
      currentFans: composed.band.fanCount,
    });

    // Member development (ADR-0012) — computed *after* the evaluation: the work
    // is judged by the skills that made it; the growth is its consequence.
    const growth = evaluateMemberGrowth({
      credits: release.credits,
      members: composed.members.map((m) => ({
        id: m.id,
        name: m.name,
        skills: m.skills,
        happiness: m.happiness,
      })),
      quality: evaluation.quality,
      formatWeight: format.skillGain,
    });

    if (composed.band.balance < evaluation.cost) {
      throw new BadRequestException(
        "Insufficient balance to finalize this release.",
      );
    }

    const newBalance =
      Math.round(
        (composed.band.balance - evaluation.cost + evaluation.upfront) * 100,
      ) / 100;
    const newFans = composed.band.fanCount + evaluation.fansGained;

    await this.bandsRepository.applyBandStateChanges(bandId, {
      balance: newBalance,
      fanCount: newFans,
      memberSkills: growth.map((outcome) => ({
        memberId: outcome.memberId,
        skills: outcome.skills,
      })),
      memberHappiness: growth.map((outcome) => ({
        memberId: outcome.memberId,
        happiness: outcome.happiness,
      })),
    });

    const finalized = await this.releasesRepository.finalize(releaseId, {
      quality: evaluation.quality,
      qualityTier: evaluation.qualityTier.id,
      criticScore: reviews.critic,
      publicScore: reviews.public,
      fansGained: evaluation.fansGained,
      cost: evaluation.cost,
      masterRevenueTotal: evaluation.masterRevenueTotal,
      publishingRevenueTotal: evaluation.publishingRevenueTotal,
      royaltyRemaining: evaluation.royaltyTail,
      royaltyTurnsLeft: ROYALTY_WINDOW_TURNS,
      releasedAtYear: composed.band.currentYear,
      creationLog,
      details: {
        ...evaluation.factors,
        reviews: reviews.factors,
        growth: growth.map((outcome) => outcome.record),
      },
    });

    this.logger.log(
      `Launched release ${releaseId} (${evaluation.qualityTier.id}) for band ${bandId}.`,
    );
    return toReleaseView(finalized);
  }
}
