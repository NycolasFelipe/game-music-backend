import { Inject, Injectable } from "@nestjs/common";
import { MemberDepartureInput } from "@/modules/events/application/dto/member-departure.input";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import type { PassiveEventsRepository } from "@/modules/events/domain/repositories/passive-events.repository";

/**
 * Records member departures on the band's timeline as internal passive events
 * (ADR-0010, ADR-0032). Called by the turn tick when members leave over unpaid
 * salary or a lasting bad mood, so the departure shows up in the timeline like
 * any other event.
 */
@Injectable()
export class RecordMemberDeparturesUseCase {
  constructor(
    @Inject(PASSIVE_EVENTS_REPOSITORY)
    private readonly passiveEventsRepository: PassiveEventsRepository,
  ) {}

  /**
   * Persists one internal timeline event per departure. A no-op when the list
   * is empty.
   *
   * @param bandId - The band the members belonged to.
   * @param year - The in-game year the departures happened.
   * @param departures - The members who left (name, turns unpaid and reason).
   * @returns A promise that resolves once recorded.
   */
  async execute(
    bandId: string,
    year: number,
    departures: MemberDepartureInput[],
  ): Promise<void> {
    if (departures.length === 0) {
      return;
    }

    await this.passiveEventsRepository.createMany(
      departures.map((departure) => ({
        bandId,
        templateId: "saida_integrante",
        year,
        type: "saida_integrante" as const,
        description: this.describe(departure),
        artists: [departure.memberName],
      })),
    );
  }

  /**
   * Writes the timeline line for one departure, by its reason.
   *
   * @param departure - The member who left.
   * @returns The timeline description.
   */
  private describe(departure: MemberDepartureInput): string {
    if (departure.reason === "humor") {
      return (
        `${departure.memberName} deixou a banda depois de meses seguidos ` +
        `sem achar graça em nada.`
      );
    }
    return (
      `${departure.memberName} deixou a banda após ` +
      `${this.unpaidSpan(departure.unpaidTurns)} sem receber salário.`
    );
  }

  /**
   * Writes a number of turns as approximate time (ADR-0033). Turn dates are
   * drawn inside each half of the year, so the gap between turns varies and is
   * never written as an exact number of months.
   *
   * @param turns - How many turns went by.
   * @returns The span in words, e.g. "alguns meses" or "cerca de um ano".
   */
  private unpaidSpan(turns: number): string {
    if (turns <= 1) {
      return "alguns meses";
    }
    if (turns === 2) {
      return "cerca de um ano";
    }
    if (turns === 3) {
      return "mais de um ano";
    }
    const years = Math.round(turns / 2);
    const words = ["", "um", "dois", "três", "quatro", "cinco"];
    return `cerca de ${words[years] ?? years} anos`;
  }
}
