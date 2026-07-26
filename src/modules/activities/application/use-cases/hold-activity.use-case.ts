import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { ActivityResultView } from "@/modules/activities/application/dto/activity-result.view";
import { HoldActivityInput } from "@/modules/activities/application/dto/hold-activity.input";
import { toBandActivityView } from "@/modules/activities/application/mappers/activity.mapper";
import { generateActivityStory } from "@/modules/activities/domain/activity/activity-story.generator";
import { evaluateActivity } from "@/modules/activities/domain/activity/activity.calculator";
import { findActivity } from "@/modules/activities/domain/data/activities";
import {
  BAND_ACTIVITIES_REPOSITORY,
  type BandActivitiesRepository,
} from "@/modules/activities/domain/repositories/band-activities.repository";
import { calculateFameLevel } from "@/modules/bands/domain/fame/fame.calculator";
import {
  BANDS_REPOSITORY,
  type BandsRepository,
} from "@/modules/bands/domain/repositories/bands.repository";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { toActiveEventView } from "@/modules/events/application/mappers/active-event.mapper";
import { generateFalloutEvent } from "@/modules/events/domain/generation/fallout-event.generator";
import {
  ACTIVE_EVENTS_REPOSITORY,
  type ActiveEventsRepository,
} from "@/modules/events/domain/repositories/active-events.repository";

/**
 * Holds a confraternização (ADR-0017): validates the guest list, charges the
 * cash, lifts the mood and mends the bonds of whoever went — and, when the night
 * goes wrong, raises the decision it left behind.
 */
@Injectable()
export class HoldActivityUseCase {
  private readonly logger = new Logger(HoldActivityUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_ACTIVITIES_REPOSITORY)
    private readonly activitiesRepository: BandActivitiesRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
  ) {}

  /**
   * Holds one activity for a band the actor owns.
   *
   * @param actor - The authenticated band owner.
   * @param bandId - The band id.
   * @param input - The activity and its guest list.
   * @returns What the activity changed, and the trouble it raised (if any).
   * @throws {NotFoundException} When the band or the activity does not exist.
   * @throws {BadRequestException} When the guest list or the cash do not allow it.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: HoldActivityInput,
  ): Promise<ActivityResultView> {
    const composed = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    if (!composed) {
      throw new NotFoundException("Band not found for this owner.");
    }

    const activity = findActivity(input.activityId);
    if (!activity) {
      throw new NotFoundException("Unknown activity.");
    }

    const guestIds = [...new Set(input.participantIds)];
    const participants = composed.members.filter((member) =>
      guestIds.includes(member.id),
    );
    if (participants.length !== guestIds.length) {
      throw new BadRequestException(
        "The guest list contains someone who is not in the band.",
      );
    }
    if (
      participants.length < activity.minParticipants ||
      participants.length > activity.maxParticipants
    ) {
      throw new BadRequestException(
        `This activity takes from ${activity.minParticipants} to ${activity.maxParticipants} people (got ${participants.length}).`,
      );
    }

    const heldThisTurn = await this.activitiesRepository.countByBandAndYear(
      bandId,
      composed.band.currentYear,
    );

    const evaluation = evaluateActivity({
      activity,
      participants: participants.map((member) => ({
        id: member.id,
        happiness: member.happiness,
      })),
      relationships: composed.relationships.map((relationship) => ({
        memberAId: relationship.memberAId,
        memberBId: relationship.memberBId,
        level: relationship.level,
      })),
      fameLevel: calculateFameLevel(composed.band.fanCount),
      heldThisTurn,
    });

    if (composed.band.balance < evaluation.cost) {
      throw new BadRequestException(
        "Insufficient balance to cover this activity.",
      );
    }

    const newBalance =
      Math.round((composed.band.balance - evaluation.cost) * 100) / 100;

    // The good part lands either way: the night happened. What went wrong came
    // after it (ADR-0017 §3).
    await this.bandsRepository.applyBandStateChanges(bandId, {
      balance: newBalance,
      memberHappiness: evaluation.memberHappiness,
      relationshipLevels: evaluation.relationshipLevels,
    });

    const trouble = Math.random() < evaluation.troubleChance;
    const troubleEvent = trouble
      ? await this.raiseTrouble(bandId, composed, evaluation.weakestPair)
      : null;

    const nameOf = (id: string) =>
      composed.members.find((member) => member.id === id)?.name ?? "alguém";
    const story = generateActivityStory({
      activity,
      participantNames: participants.map((member) => member.name),
      weakestPair: evaluation.weakestPair
        ? {
            a: nameOf(evaluation.weakestPair.memberAId),
            b: nameOf(evaluation.weakestPair.memberBId),
            level: evaluation.weakestPair.level,
          }
        : null,
      trouble,
      saturation: evaluation.saturation,
      seed: Math.random(),
    });

    const recorded = await this.activitiesRepository.create({
      bandId,
      activityId: activity.id,
      heldAtYear: composed.band.currentYear,
      cost: evaluation.cost,
      participantIds: participants.map((member) => member.id),
      happinessDelta: evaluation.happinessDelta,
      relationshipDelta: evaluation.relationshipDelta,
      trouble,
      troubleEventId: troubleEvent?.id ?? null,
      story,
    });

    this.logger.log(
      `Band ${bandId} held "${activity.id}" with ${participants.length} people ` +
        `(cost ${evaluation.cost}, saturation ${evaluation.saturation})` +
        (trouble ? " — and it went wrong." : "."),
    );

    const happinessBefore = new Map(
      participants.map((member) => [member.id, member.happiness]),
    );
    const levelBefore = new Map(
      composed.relationships.map((relationship) => [
        `${relationship.memberAId}:${relationship.memberBId}`,
        relationship.level,
      ]),
    );

    return {
      activity: toBandActivityView(recorded),
      balance: newBalance,
      saturation: evaluation.saturation,
      troubleChance: evaluation.troubleChance,
      trouble,
      participants: evaluation.memberHappiness.map((entry) => ({
        memberId: entry.memberId,
        name:
          participants.find((member) => member.id === entry.memberId)?.name ??
          "",
        from: happinessBefore.get(entry.memberId) ?? entry.happiness,
        to: entry.happiness,
      })),
      relationshipChanges: evaluation.relationshipLevels.map((entry) => ({
        memberAId: entry.memberAId,
        memberBId: entry.memberBId,
        from: levelBefore.get(`${entry.memberAId}:${entry.memberBId}`) ?? 0,
        to: entry.level,
      })),
      troubleEvent,
    };
  }

  /**
   * Raises the decision a bad night left behind, on the most hostile pair that
   * was in the room.
   *
   * @param bandId - The band id.
   * @param composed - The band with its members, for the characters' data.
   * @param pair - The pair the trouble fell on, if any.
   * @returns The generated event view, or `null` when none could be built.
   */
  private async raiseTrouble(
    bandId: string,
    composed: Awaited<
      ReturnType<BandsRepository["findByIdAndOwnerWithMembers"]>
    >,
    pair: { memberAId: string; memberBId: string } | null,
  ): Promise<ActiveEventView | null> {
    if (!composed || !pair) return null;

    const characterOf = (id: string) => {
      const member = composed.members.find((candidate) => candidate.id === id);
      return member
        ? {
            id: member.id,
            name: member.name,
            characteristics: member.characteristics,
          }
        : null;
    };

    const first = characterOf(pair.memberAId);
    const second = characterOf(pair.memberBId);
    if (!first || !second) return null;

    const generated = generateFalloutEvent({
      year: composed.band.currentYear,
      pair: [first, second],
    });
    if (!generated) return null;

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

    return toActiveEventView(created);
  }
}
