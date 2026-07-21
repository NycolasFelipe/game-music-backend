import { Inject, Injectable } from "@nestjs/common";
import { MemberDepartureInput } from "@/modules/events/application/dto/member-departure.input";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import type { PassiveEventsRepository } from "@/modules/events/domain/repositories/passive-events.repository";

/**
 * Records member departures on the band's timeline as internal passive events
 * (ADR-0010). Called by the turn tick when members leave over unpaid salary, so
 * the departure shows up in the timeline like any other event.
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
   * @param departures - The members who left (name + turns unpaid).
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
        description:
          `${departure.memberName} deixou a banda após ${departure.unpaidTurns} ` +
          `turno(s) sem receber salário.`,
        artists: [departure.memberName],
      })),
    );
  }
}
