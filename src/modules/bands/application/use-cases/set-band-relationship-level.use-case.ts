import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import { toMemberRelationshipView } from "@/modules/bands/application/mappers/band.mapper";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import type { MemberRelationshipsRepository } from "@/modules/bands/domain/repositories/member-relationships.repository";

/** Input for setting a relationship level. */
export interface SetRelationshipLevelInput {
  memberId1: string;
  memberId2: string;
  level: number;
}

/**
 * Sets (upserts) the relationship level between two members of a band owned by
 * the actor.
 */
@Injectable()
export class SetBandRelationshipLevelUseCase {
  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(MEMBER_RELATIONSHIPS_REPOSITORY)
    private readonly relationshipsRepository: MemberRelationshipsRepository,
  ) {}

  /**
   * Verifies band ownership, then upserts the level between the two members.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param input - The two member ids and the new level.
   * @returns The updated relationship as a public view.
   * @throws {NotFoundException} When the band is not found, or a member does
   * not belong to the band.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: SetRelationshipLevelInput,
  ): Promise<MemberRelationshipView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const relationship = await this.relationshipsRepository.setLevel(
      bandId,
      input.memberId1,
      input.memberId2,
      input.level,
    );
    if (!relationship) {
      throw new NotFoundException(
        "Both members must belong to the band and be distinct",
      );
    }

    return toMemberRelationshipView(relationship);
  }
}
