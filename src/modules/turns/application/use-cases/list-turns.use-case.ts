import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { TurnView } from "@/modules/turns/application/dto/turn.view";
import { toTurnView } from "@/modules/turns/application/mappers/turn.mapper";
import { TURNS_REPOSITORY } from "@/modules/turns/domain/repositories/turns.repository";
import type { TurnsRepository } from "@/modules/turns/domain/repositories/turns.repository";

/**
 * Lists a band's recorded turns (its turn timeline), oldest first.
 */
@Injectable()
export class ListTurnsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(TURNS_REPOSITORY)
    private readonly turnsRepository: TurnsRepository,
  ) {}

  /**
   * Verifies band ownership and returns its recorded turns.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's turns as public views.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<TurnView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const turns = await this.turnsRepository.findByBandId(bandId);
    return turns.map(toTurnView);
  }
}
