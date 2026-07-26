import { Inject, Injectable, Logger } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { ReleaseProductionView } from "@/modules/releases/application/dto/release-production.view";
import {
  creditedMemberIds,
  CREATION_EVENTS_PER_SESSION,
} from "@/modules/releases/domain/constants/release.constant";
import { generateCreationEvents } from "@/modules/releases/domain/generation/creation-event.generator";
import {
  RELEASES_REPOSITORY,
  type ReleasesRepository,
} from "@/modules/releases/domain/repositories/releases.repository";

/**
 * Runs one turn of production on the band's work in progress (ADR-0015): burns a
 * production turn and, while there is still studio time ahead, brings up the
 * next session's decision — generated from the band **as it is now**, so a long
 * production reflects the mood, line-up and relationships of each turn.
 * Called by the turn tick.
 */
@Injectable()
export class AdvanceReleaseProductionUseCase {
  private readonly logger = new Logger(AdvanceReleaseProductionUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
  ) {}

  /**
   * Advances the band's draft by one production turn.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @returns How the production moved, or `null` when nothing is being recorded.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<ReleaseProductionView | null> {
    const draft = await this.releasesRepository.findInCreation(bandId);
    if (!draft) {
      return null;
    }

    const turnsLeft = Math.max(0, draft.productionTurnsLeft - 1);
    if (turnsLeft !== draft.productionTurnsLeft) {
      await this.releasesRepository.setProductionTurnsLeft(draft.id, turnsLeft);
    }

    const newSession =
      turnsLeft > 0 ? await this.openSession(actor, bandId, draft.id) : false;

    this.logger.log(
      `Release ${draft.id} production: ${turnsLeft} turn(s) left` +
        `${turnsLeft === 0 ? " — ready to launch" : ""}` +
        `${newSession ? " — new studio session" : ""}.`,
    );

    return {
      releaseId: draft.id,
      title: draft.title,
      turnsLeft,
      ready: turnsLeft === 0,
      newSession,
    };
  }

  /**
   * Brings up the next studio session for a draft, skipping the kinds of drama
   * the work already went through.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @param releaseId - The draft in production.
   * @returns `true` when a new decision was created.
   */
  private async openSession(
    actor: AuthenticatedUserEntity,
    bandId: string,
    releaseId: string,
  ): Promise<boolean> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    const draft = await this.releasesRepository.findByIdAndBand(
      releaseId,
      bandId,
    );
    if (!composed || !draft) {
      return false;
    }

    const existing =
      await this.releasesRepository.findCreationEventsByRelease(releaseId);
    const creditedSet = new Set(creditedMemberIds(draft.credits));

    const events = generateCreationEvents(
      composed.members
        .filter((member) => creditedSet.has(member.id))
        .map((member) => ({
          id: member.id,
          name: member.name,
          characteristics: member.characteristics,
        })),
      composed.relationships.map((relationship) => ({
        memberAId: relationship.memberAId,
        memberBId: relationship.memberBId,
        level: relationship.level,
      })),
      {
        limit: CREATION_EVENTS_PER_SESSION,
        startSequence: existing.length,
        excludeKinds: existing.map((event) => event.kind),
      },
    );
    if (events.length === 0) {
      return false;
    }

    await this.releasesRepository.createCreationEvents(releaseId, events);
    return true;
  }
}
