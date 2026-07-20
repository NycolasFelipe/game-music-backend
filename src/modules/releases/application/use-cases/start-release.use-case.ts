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
import type { StartReleaseInput } from "@/modules/releases/application/dto/start-release.input";
import { toReleaseView } from "@/modules/releases/application/mappers/release.mapper";
import { creditedMemberIds } from "@/modules/releases/domain/constants/release.constant";
import { findBudgetTier } from "@/modules/releases/domain/data/budget-tiers";
import { findReleaseFormat } from "@/modules/releases/domain/data/release-formats";
import { generateCreationEvents } from "@/modules/releases/domain/generation/creation-event.generator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Starts a release draft (`em_criacao`) for a band the actor owns. Validates the
 * format, budget tier, credits (must reference this band's members) and that the
 * band has no other draft in progress and can afford the production cost.
 */
@Injectable()
export class StartReleaseUseCase {
  private readonly logger = new Logger(StartReleaseUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Starts a release draft.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band the release belongs to.
   * @param input - The draft's authorship (title/concept/style/format/budget/credits).
   * @returns The created draft view.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: StartReleaseInput,
  ): Promise<ReleaseView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!composed) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const format = findReleaseFormat(input.format);
    if (!format) {
      throw new BadRequestException(`Unknown format: ${input.format}`);
    }
    const budgetTier = findBudgetTier(input.budgetTier);
    if (!budgetTier) {
      throw new BadRequestException(`Unknown budget tier: ${input.budgetTier}`);
    }

    const memberIds = new Set(composed.members.map((m) => m.id));
    const credited = creditedMemberIds(input.credits);
    if (credited.length === 0) {
      throw new BadRequestException("At least one aspect must be credited.");
    }
    for (const id of credited) {
      if (!memberIds.has(id)) {
        throw new BadRequestException(
          `Credited member does not belong to the band: ${id}`,
        );
      }
    }

    const inCreation = await this.releasesRepository.countInCreation(bandId);
    if (inCreation > 0) {
      throw new ConflictException(
        "This band already has a release in creation.",
      );
    }

    const cost = format.baseCost * budgetTier.costMultiplier;
    if (composed.band.balance < cost) {
      throw new BadRequestException(
        "Insufficient balance to start this release.",
      );
    }

    const release = await this.releasesRepository.create({
      bandId,
      title: input.title,
      concept: input.concept,
      format: input.format,
      style: input.style,
      budgetTier: input.budgetTier,
      credits: input.credits,
    });

    const creditedSet = new Set(credited);
    const creationEvents = generateCreationEvents(
      composed.members
        .filter((m) => creditedSet.has(m.id))
        .map((m) => ({
          id: m.id,
          name: m.name,
          characteristics: m.characteristics,
        })),
      composed.relationships.map((r) => ({
        memberAId: r.memberAId,
        memberBId: r.memberBId,
        level: r.level,
      })),
    );
    await this.releasesRepository.createCreationEvents(
      release.id,
      creationEvents,
    );

    this.logger.log(
      `Started release ${release.id} for band ${bandId} ` +
        `(${creationEvents.length} creation events).`,
    );
    return toReleaseView(release);
  }
}
