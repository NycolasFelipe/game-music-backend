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
import { RecordMemberDeparturesUseCase } from "@/modules/events/application/use-cases/record-member-departures.use-case";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import type { ActiveEventsRepository } from "@/modules/events/domain/repositories/active-events.repository";
import {
  computeMoodTick,
  fansAfterDepartures,
} from "@/modules/band-members/domain/mood/mood.calculator";
import { ArchiveMemberDeparturesUseCase } from "@/modules/band-members/application/use-cases/archive-member-departures.use-case";
import { AutoAdjustSalariesUseCase } from "@/modules/band-members/application/use-cases/auto-adjust-salaries.use-case";
import { PaySalariesUseCase } from "@/modules/band-members/application/use-cases/pay-salaries.use-case";
import { AccrueReleaseRoyaltiesUseCase } from "@/modules/releases/application/use-cases/accrue-release-royalties.use-case";
import { AdvanceReleaseProductionUseCase } from "@/modules/releases/application/use-cases/advance-release-production.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import type { ReleasesRepository } from "@/modules/releases/domain/repositories/releases.repository";
import { AdvanceTurnView } from "@/modules/turns/application/dto/advance-turn.view";
import type { TurnDeltaView } from "@/modules/turns/application/dto/turn-delta.view";
import { formatPeriod } from "@/modules/turns/application/mappers/turn.mapper";
import {
  ACTIVE_EVENT_CHANCE,
  PASSIVE_EVENTS_PER_TURN,
  TURN_STEP,
} from "@/modules/turns/domain/constants/turn.constant";
import type { TurnEntity } from "@/modules/turns/domain/entities/turn.entity";
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
    private readonly advanceReleaseProduction: AdvanceReleaseProductionUseCase,
    private readonly autoAdjustSalaries: AutoAdjustSalariesUseCase,
    private readonly paySalaries: PaySalariesUseCase,
    private readonly archiveMemberDepartures: ArchiveMemberDeparturesUseCase,
    private readonly recordMemberDepartures: RecordMemberDeparturesUseCase,
  ) {}

  /**
   * Runs a single turn advance for a band owned by the actor.
   *
   * Besides the tick itself, the result carries a turn report (ADR-0020): the
   * cash before and after the tick, the royalties per release, the salaries
   * paid, and the change in cash and fans since the previous turn closed (taken
   * from that turn's snapshot, so it includes the player's actions).
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

    // A work in production is *expected* to cross turns (ADR-0015 §1) — what
    // blocks the clock is a studio decision waiting on the player, mirroring the
    // rule for active events.
    const pendingSessions =
      await this.releasesRepository.countPendingCreationEventsByBand(bandId);
    if (pendingSessions > 0) {
      throw new ConflictException(
        "Resolve the pending studio decision before advancing the turn",
      );
    }

    const previousTurn = await this.turnsRepository.findLatestByBandId(bandId);
    const previousYear = band.currentYear;
    const newYear = previousYear + TURN_STEP;
    const agedMembers = Math.floor(newYear) !== Math.floor(previousYear);

    // Scene news for the new period (ADR-0024); the report keeps the first one.
    const passiveViews = await this.generatePassiveEvents.execute(
      actor,
      bandId,
      newYear,
      PASSIVE_EVENTS_PER_TURN,
    );
    const passiveEvent = passiveViews[0] ?? null;

    // Advance the band's clock and age members at a calendar-year rollover.
    await this.bandsRepository.advanceTurn(bandId, {
      newYear,
      ageMembers: agedMembers,
    });

    // Burn a production turn on the work being recorded and, if the studio time
    // continues, bring up this turn's session (ADR-0015 §1/§3).
    const production = await this.advanceReleaseProduction.execute(
      actor,
      bandId,
    );

    // Accrue this turn's release royalties (income), then pay salaries (expense)
    // from the resulting cash. Money, happiness (salary satisfaction/arrears and
    // the drift to neutral) and member departures (unpaid salary or bad mood,
    // each costing fans) are the band-state the tick moves (ADR-0008 + ADR-0010
    // emendas to ADR-0006 §6, ADR-0032); relationships still only change via
    // events and activities.
    const accrual = await this.accrueReleaseRoyalties.execute(bandId);
    const royalties = accrual.total;
    const cashBeforePayroll =
      Math.round((band.balance + royalties) * 100) / 100;

    // Optional automatic raises (ADR-0013), between the income and the payroll:
    // they see the cash the royalties just brought in, and the payroll below
    // already pays the adjusted salaries.
    const salaryRaises = band.autoSalaryAdjust
      ? await this.autoAdjustSalaries.execute(
          bandId,
          band.fanCount,
          cashBeforePayroll,
          newYear,
        )
      : [];

    const payroll = await this.paySalaries.execute(
      bandId,
      band.fanCount,
      cashBeforePayroll,
    );
    const balanceAfter =
      Math.round((cashBeforePayroll - payroll.totalPaid) * 100) / 100;

    const salaryDepartures = payroll.outcomes.filter((o) => o.departed);
    const stayed = payroll.outcomes.filter((o) => !o.departed);

    // The mood drifts back toward neutral and a member kept in a bad mood
    // leaves (ADR-0032 §2 and §5), after the payroll moved the happiness.
    const lowMoodTurns = await this.lowMoodTurnsByMember(actor, bandId);
    const mood = new Map(
      computeMoodTick(
        stayed.map((o) => ({
          memberId: o.memberId,
          happiness: o.newHappiness,
          lowMoodTurns: lowMoodTurns.get(o.memberId) ?? 0,
        })),
      ).map((outcome) => [outcome.memberId, outcome]),
    );
    const moodDepartures = stayed.filter((o) => mood.get(o.memberId)?.departed);
    const survivors = stayed.filter((o) => !mood.get(o.memberId)?.departed);
    const departingOutcomes = [
      ...salaryDepartures.map((o) => ({
        ...o,
        reason: "salario_atrasado" as const,
      })),
      ...moodDepartures.map((o) => ({ ...o, reason: "humor" as const })),
    ];
    const departedMemberIds = departingOutcomes.map((o) => o.memberId);

    // Every departure costs a share of the fans (ADR-0032 §5).
    const fanCountAfter = fansAfterDepartures(
      band.fanCount,
      departedMemberIds.length,
    );

    // Members in arrears who have not left yet. The exact deadline is kept from
    // the player (more gamified) — only the risk is surfaced (ADR-0010 §6).
    const atRiskMemberIds = survivors
      .filter((o) => !o.paid)
      .map((o) => o.memberId);
    // Members in a bad mood who leave if it lasts one more advance (ADR-0032).
    const moodAtRiskMemberIds = survivors
      .filter((o) => mood.get(o.memberId)?.atRisk)
      .map((o) => o.memberId);

    // Archive the departing members BEFORE they are removed, so ex-members stay
    // viewable and the departure modal has their full snapshot.
    const departures = await this.archiveMemberDepartures.execute(
      bandId,
      newYear,
      departingOutcomes.map((o) => ({
        memberId: o.memberId,
        unpaidTurns: o.newUnpaidTurns,
        reason: o.reason,
      })),
    );

    if (balanceAfter !== band.balance || payroll.outcomes.length > 0) {
      await this.bandsRepository.applyBandStateChanges(bandId, {
        balance: balanceAfter,
        fanCount: fanCountAfter !== band.fanCount ? fanCountAfter : undefined,
        memberHappiness: survivors.map((o) => ({
          memberId: o.memberId,
          happiness: mood.get(o.memberId)?.newHappiness ?? o.newHappiness,
        })),
        memberSalaryArrears: survivors.map((o) => ({
          memberId: o.memberId,
          unpaidTurns: o.newUnpaidTurns,
        })),
        memberLowMoodTurns: survivors.map((o) => ({
          memberId: o.memberId,
          lowMoodTurns: mood.get(o.memberId)?.newLowMoodTurns ?? 0,
        })),
        removedMemberIds: departedMemberIds.length
          ? departedMemberIds
          : undefined,
      });
    }

    // Record departures on the timeline as internal passive events.
    await this.recordMemberDepartures.execute(
      bandId,
      newYear,
      departingOutcomes.map((o) => ({
        memberName: o.name,
        unpaidTurns: o.newUnpaidTurns,
        reason: o.reason,
      })),
    );

    // Chance to spawn a blocking decision event for the player.
    const activeEvent = this.rollActiveEvent()
      ? await this.tryGenerateActiveEvent(actor, bandId, newYear)
      : null;

    const climate = await this.bandsRepository.getBandMemberAverages(bandId);

    await this.turnsRepository.create({
      bandId,
      year: newYear,
      fanCountSnapshot: fanCountAfter,
      balanceSnapshot: balanceAfter,
      happinessAvgSnapshot: climate.happinessAvg,
      relationshipAvgSnapshot: climate.relationshipAvg,
      passiveEventId: passiveEvent?.id ?? null,
      activeEventId: activeEvent?.id ?? null,
    });

    this.logger.log(
      `Band ${bandId} advanced to ${formatPeriod(bandId, newYear)}` +
        `${agedMembers ? " (members aged)" : ""}` +
        `${activeEvent ? ` — active event "${activeEvent.templateId}"` : ""}` +
        `${payroll.totalPaid > 0 ? ` — paid ${payroll.totalPaid} in salaries` : ""}` +
        `${salaryRaises.length ? ` — ${salaryRaises.length} salary(ies) auto-adjusted` : ""}` +
        `${production ? ` — "${production.title}" ${production.ready ? "ready to launch" : `has ${production.turnsLeft} production turn(s) left`}` : ""}` +
        `${salaryDepartures.length ? ` — ${salaryDepartures.length} member(s) left over unpaid salary` : ""}` +
        `${moodDepartures.length ? ` — ${moodDepartures.length} member(s) left over a bad mood` : ""}`,
    );

    return {
      previousYear,
      year: newYear,
      period: formatPeriod(bandId, newYear),
      agedMembers,
      passiveEvent,
      activeEvent,
      salariesDue: payroll.totalDue,
      salariesPaid: payroll.totalPaid,
      salariesFullyPaid: payroll.fullyPaid,
      salaryRaises,
      production,
      departures,
      atRiskMemberIds,
      moodAtRiskMemberIds,
      fansLostToDepartures: band.fanCount - fanCountAfter,
      report: {
        balanceBefore: band.balance,
        royalties,
        royaltyPayouts: accrual.payouts,
        salariesPaid: payroll.totalPaid,
        balanceAfter,
        fanCount: fanCountAfter,
        sinceLastTurn: this.sinceLastTurn(
          previousTurn,
          balanceAfter,
          fanCountAfter,
        ),
      },
    };
  }

  /**
   * Computes the change since the previous turn closed (ADR-0020).
   *
   * @param previousTurn - The band's latest turn before this one, if any.
   * @param balanceAfter - The cash after this tick.
   * @param fanCount - The fans after this tick.
   * @returns The deltas, or `null` on the first turn or when the previous turn
   *   has no balance snapshot.
   */
  private sinceLastTurn(
    previousTurn: TurnEntity | null,
    balanceAfter: number,
    fanCount: number,
  ): TurnDeltaView | null {
    if (!previousTurn || previousTurn.balanceSnapshot === null) {
      return null;
    }
    return {
      balanceDelta:
        Math.round((balanceAfter - previousTurn.balanceSnapshot) * 100) / 100,
      fanCountDelta: fanCount - previousTurn.fanCountSnapshot,
    };
  }

  /**
   * Reads each member's bad-mood counter (ADR-0032 §5).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The counter per member id (empty when the band is not found).
   */
  private async lowMoodTurnsByMember(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<Map<string, number>> {
    const band = await this.bandsRepository.findByIdAndOwnerWithMembers(
      bandId,
      actor.id,
    );
    return new Map(
      (band?.members ?? []).map((member) => [member.id, member.lowMoodTurns]),
    );
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
