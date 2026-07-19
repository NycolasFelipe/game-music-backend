import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { toBandMemberView } from "@/modules/bands/application/mappers/band.mapper";
import { BAND_MEMBERS_MAX } from "@/modules/bands/domain/constants/band.constant";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import type { MemberRelationshipsRepository } from "@/modules/bands/domain/repositories/member-relationships.repository";
import { AddBandMemberInput } from "@/modules/band-members/application/dto/add-band-member.input";
import { getUnknownCharacteristicIds } from "@/modules/band-members/domain/data/characteristics";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import type { BandMembersRepository } from "@/modules/band-members/domain/repositories/band-members.repository";

/**
 * Adds a member to a band owned by the actor.
 */
@Injectable()
export class AddBandMemberUseCase {
  private readonly logger = new Logger(AddBandMemberUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
    @Inject(BAND_MEMBERS_REPOSITORY)
    private readonly bandMembersRepository: BandMembersRepository,
    @Inject(MEMBER_RELATIONSHIPS_REPOSITORY)
    private readonly relationshipsRepository: MemberRelationshipsRepository,
  ) {}

  /**
   * Verifies band ownership, enforces the max band size and the characteristic
   * catalog, then persists the new member.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The target band id.
   * @param input - The member data to add.
   * @returns The created member as a public view.
   * @throws {NotFoundException} When the band is not found for this owner.
   * @throws {ConflictException} When the band already has the max members.
   * @throws {BadRequestException} When characteristics are not in the catalog.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    bandId: string,
    input: AddBandMemberInput,
  ): Promise<BandMemberView> {
    const band = await this.bandsRepository.findByIdAndOwner(bandId, actor.id);
    if (!band) {
      throw new NotFoundException("Band not found");
    }

    const currentCount = await this.bandMembersRepository.countByBandId(bandId);
    if (currentCount >= BAND_MEMBERS_MAX) {
      throw new ConflictException(
        `A band cannot have more than ${BAND_MEMBERS_MAX} members.`,
      );
    }

    const unknown = getUnknownCharacteristicIds(input.characteristics);
    if (unknown.length > 0) {
      throw new BadRequestException(
        `Unknown characteristics: ${unknown.join(", ")}`,
      );
    }

    const member = await this.bandMembersRepository.create({
      bandId,
      ...input,
    });

    // Generate relationships between the new member and the existing ones.
    await this.relationshipsRepository.syncForMember(bandId, member.id);

    this.logger.log(`Member "${member.name}" added to band ${bandId}`);

    return toBandMemberView(member);
  }
}
