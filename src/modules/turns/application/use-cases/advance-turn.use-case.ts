import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { GeneratePassiveEventsUseCase } from "@/modules/events/application/use-cases/generate-passive-events.use-case";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";
import { PaySalariesUseCase } from "@/modules/band-members/application/use-cases/pay-salaries.use-case";
import { AccrueReleaseRoyaltiesUseCase } from "@/modules/releases/application/use-cases/accrue-release-royalties.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import type { ReleasesRepository } from "@/modules/releases/domain/repositories/releases.repository";
import { AdvanceTurnView } from "@/modules/turns/application/dto/advance-turn.view";
import { formatPeriod } from "@/modules/turns/application/mappers/turn.mapper";
import {
  ACTIVE_EVENT_CHANCE,
  TURN_STEP,
} from "@/modules/turns/domain/constants/turn.constant";
import { TURNS_REPOSITORY } from "@/modules/turns/domain/repositories/turns.repository";
import type { TurnsRepository } from "@/modules/turns/domain/repositories/turns.repository";

/**
 * Advances a band's clock by one turn (half a year) and runs the tick: it
 * generates a passive (timeline) event, ages members on a calendar-year
 * rollover, may roll a blocking active (decision) event, and records the turn.
 *
 * Advancing is refused while the band has unresolved active events, mirroring
 * the frontend rule that pending decisions must be resolved first.
 */
@Injectable()
export class AdvanceTurnUseCase {
  private readonly logger = new Logger(AdvanceTurnUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(ACTIVE_EVENTS_REPOSITORY)
    private readonly activeEventsRepository: ActiveEventsRepository,
    @Inject(TURNS_REPOSITORY)
    private readonly turnsRepository: TurnsRepository,
    @Inject(RELEASES_REPOSITORY)
    private readonly releasesRepository: ReleasesRepository,
    private readonly generatePassiveEvents: GeneratePassiveEventsUseCase,
    private readonly generateActiveEvent: GenerateActiveEventUseCase,
    private readonly accrueReleaseRoyalties: AccrueReleaseRoyaltiesUseCase,
    private readonly paySalaries: PaySalariesUseCase,
  ) {}

  /**
   * Runs a single turn advance for a band owned by the actor.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The new clock and any events produced this turn.
   * @throws {NotFoundException} When the band is not found for this owner.
   * @throws {ConflictException} When the band has unresolved active events.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<AdvanceTurnView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const unresolved =
      await this.activeEventsRepository.countUnresolved(bandId);
    if (unresolved > 0) {
      throw new ConflictException(
        "Resolve pending active events before advancing the turn",
      );
    }

    const inCreation = await this.releasesRepository.countInCreation(bandId);
    if (inCreation > 0) {
      throw new ConflictException(
        "Finish or discard the release in creation before advancing the turn",
      );
    }

    const previousYear = band.currentYear;
    const newYear = previousYear + TURN_STEP;
    const agedMembers = Math.floor(newYear) !== Math.floor(previousYear);

    // Passive flavor event for the new period (empty when nothing eligible).
    const passiveViews = await this.generatePassiveEvents.execute(
      actor,
      bandId,
      newYear,
      1,
    );
    const passiveEvent = passiveViews[0] ?? null;

    // Advance the band's clock and age members at a calendar-year rollover.
    await this.bandsRepository.advanceTurn(bandId, {
      newYear,
      ageMembers: agedMembers,
    });

    // Accrue this turn's release royalties (income), then pay salaries (expense)
    // from the resulting cash. Money, happiness (salary satisfaction/arrears) and
    // member departures over unpaid salary are the band-state the tick moves
    // (ADR-0008 + ADR-0010 emendas to ADR-0006 §6); fans and relationships still
    // only change via event resolution.
    const royalties = await this.accrueReleaseRoyalties.execute(bandId);
    const cashBeforePayroll =
      Math.round((band.balance + royalties) * 100) / 100;
    const payroll = await this.paySalaries.execute(
      bandId,
      band.fanCount,
      cashBeforePayroll,
    );
    const balanceAfter =
      Math.round((cashBeforePayroll - payroll.totalPaid) * 100) / 100;

    const survivors = payroll.outcomes.filter((o) => !o.departed);
    const departedMemberIds = payroll.outcomes
      .filter((o) => o.departed)
      .map((o) => o.memberId);

    if (balanceAfter !== band.balance || payroll.outcomes.length > 0) {
      await this.bandsRepository.applyBandStateChanges(bandId, {
        balance: balanceAfter,
        memberHappiness: survivors.map((o) => ({
          memberId: o.memberId,
          happiness: o.newHappiness,
        })),
        memberSalaryArrears: survivors.map((o) => ({
          memberId: o.memberId,
          unpaidTurns: o.newUnpaidTurns,
        })),
        removedMemberIds: departedMemberIds.length
          ? departedMemberIds
          : undefined,
      });
    }

    // Chance to spawn a blocking decision event for the player.
    const activeEvent = this.rollActiveEvent()
      ? await this.tryGenerateActiveEvent(actor, bandId, newYear)
      : null;

    const climate = await this.bandsRepository.getBandMemberAverages(bandId);

    await this.turnsRepository.create({
      bandId,
      year: newYear,
      fanCountSnapshot: band.fanCount,
      balanceSnapshot: balanceAfter,
      happinessAvgSnapshot: climate.happinessAvg,
      relationshipAvgSnapshot: climate.relationshipAvg,
      passiveEventId: passiveEvent?.id ?? null,
      activeEventId: activeEvent?.id ?? null,
    });

    this.logger.log(
      `Band ${bandId} advanced to ${formatPeriod(newYear)}` +
        `${agedMembers ? " (members aged)" : ""}` +
        `${activeEvent ? ` — active event "${activeEvent.templateId}"` : ""}` +
        `${payroll.totalPaid > 0 ? ` — paid ${payroll.totalPaid} in salaries` : ""}` +
        `${departedMemberIds.length ? ` — ${departedMemberIds.length} member(s) left over unpaid salary` : ""}`,
    );

    return {
      previousYear,
      year: newYear,
      period: formatPeriod(newYear),
      agedMembers,
      passiveEvent,
      activeEvent,
      salariesDue: payroll.totalDue,
      salariesPaid: payroll.totalPaid,
      salariesFullyPaid: payroll.fullyPaid,
      departedMemberIds,
    };
  }

  /**
   * Rolls the per-turn chance of spawning an active event.
   *
   * @returns `true` when an active event should be attempted this turn.
   */
  private rollActiveEvent(): boolean {
    return Math.random() < ACTIVE_EVENT_CHANCE;
  }

  /**
   * Generates an active event, tolerating the case where no template is
   * eligible for the band's current state (no event this turn).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param year - The year to generate for.
   * @returns The generated event, or `null` when none was eligible.
   */
  private async tryGenerateActiveEvent(
    actor: AuthenticatedUserEntity,
    bandId: string,
    year: number,
  ): Promise<ActiveEventView | null> {
    try {
      return await this.generateActiveEvent.execute(actor, bandId, year);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }
}
