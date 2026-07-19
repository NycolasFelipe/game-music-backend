import { Inject, Injectable } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandView } from "@/modules/bands/application/dto/band.view";
import { toBandView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Lists the bands owned by the actor.
 */
@Injectable()
export class ListBandsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
  ) {}

  /**
   * Returns all bands belonging to the authenticated owner (scalars only).
   *
   * @param actor - The authenticated user whose bands to list.
   * @returns The owner's bands as public views.
   */
  async execute(actor: AuthenticatedUserEntity): Promise<BandView[]> {
    const bands = await this.bandsRepository.findAllByOwner(actor.id);
    return bands.map(toBandView);
  }
}
