import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { CreateBandInput } from "@/modules/bands/application/dto/create-band.input";
import { BandWithMembersView } from "@/modules/bands/application/dto/band-with-members.view";
import { toBandWithMembersView } from "@/modules/bands/application/mappers/band.mapper";
import {
  BAND_MEMBERS_MAX,
  BAND_MEMBERS_MIN,
} from "@/modules/bands/domain/constants/band.constant";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import type { BandsRepository } from "@/modules/bands/domain/repositories/bands.repository";

/**
 * Creates a band owned by the actor, together with its initial members.
 */
@Injectable()
export class CreateBandUseCase {
  private readonly logger = new Logger(CreateBandUseCase.name);

  constructor(
    @Inject(BANDS_REPOSITORY)
    private readonly bandsRepository: BandsRepository,
  ) {}

  /**
   * Validates the membership size and persists the band with its members
   * atomically, scoped to the authenticated owner.
   *
   * @param actor - The authenticated user creating the band (its owner).
   * @param input - The band data plus 3..6 members to create.
   * @returns The created band composed with its persisted members.
   * @throws {BadRequestException} When the member count is outside 3..6.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    input: CreateBandInput,
  ): Promise<BandWithMembersView> {
    if (
      input.members.length < BAND_MEMBERS_MIN ||
      input.members.length > BAND_MEMBERS_MAX
    ) {
      throw new BadRequestException(
        `A band must have between ${BAND_MEMBERS_MIN} and ${BAND_MEMBERS_MAX} members.`,
      );
    }

    const composed = await this.bandsRepository.createWithMembers(
      {
        ownerId: actor.id,
        name: input.name,
        theme: input.theme,
        origin: input.origin,
        foundationYear: input.foundationYear,
      },
      input.members,
    );

    this.logger.log(
      `Band "${composed.band.name}" created for owner ${actor.id} with ${composed.members.length} members`,
    );

    return toBandWithMembersView(composed);
  }
}
