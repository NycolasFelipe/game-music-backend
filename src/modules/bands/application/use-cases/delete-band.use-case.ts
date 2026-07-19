import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Deletes a band (and, by cascade, its members) owned by the actor.
 */
@Injectable()
export class DeleteBandUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
  ) {}

  /**
   * Deletes the band scoped to the authenticated owner.
   *
   * @param actor - The authenticated user deleting the band.
   * @param bandId - The band id.
   * @returns A promise that resolves once the band is deleted.
   * @throws {NotFoundException} When the band does not exist for this owner.
   */
  async execute(actor: AuthenticatedUserEntity, bandId: string): Promise<void> {
    const deleted = await this.bandsRepository.deleteByIdAndOwner(
      bandId,
      actor.id,
    );

    if (!deleted) {
      throw new NotFoundException("Band not found");
    }
  }
}
