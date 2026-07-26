import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandView } from "@/modules/bands/application/dto/band.view";
import { UpdateBandSettingsInput } from "@/modules/bands/application/dto/update-band-settings.input";
import { toBandView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Changes a save's player-facing options (ADR-0013), scoped to its owner.
 */
@Injectable()
export class UpdateBandSettingsUseCase {
  private readonly logger = new Logger(UpdateBandSettingsUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
  ) {}

  /**
   * Applies the given options to the band. Omitted options keep their value.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param input - The options to change.
   * @returns The updated band view.
   * @throws {NotFoundException} When the band does not exist for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: UpdateBandSettingsInput,
  ): Promise<BandView> {
    const band = await this.bandsRepository.updateSettings(bandId, actor.id, {
      autoSalaryAdjust: input.autoSalaryAdjust,
    });
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    this.logger.log(
      `Band ${bandId} settings updated (autoSalaryAdjust=${band.autoSalaryAdjust})`,
    );
    return toBandView(band);
  }
}
