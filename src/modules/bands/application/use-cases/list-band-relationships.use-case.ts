import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import { toMemberRelationshipView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import type { MemberRelationshipsRepository } from "@/modules/bands/domain/repositories/member-relationships.repository";

/**
 * Lists the relationships between members of a band owned by the actor.
 */
@Injectable()
export class ListBandRelationshipsUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(MEMBER_RELATIONSHIPS_REPOSITORY)
    private readonly relationshipsRepository: MemberRelationshipsRepository,
  ) {}

  /**
   * Verifies band ownership and returns the band's relationships.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's relationships as public views.
   * @throws {NotFoundException} When the band is not found for this owner.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
  ): Promise<MemberRelationshipView[]> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const relationships =
      await this.relationshipsRepository.findByBandId(bandId);
    return relationships.map(toMemberRelationshipView);
  }
}
