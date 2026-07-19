import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { BandMemberView } from "@/modules/bands/application/dto/band-member.view";
import { CreateBandMemberSeedDto } from "@/modules/bands/presentation/http/dto/create-band-member-seed.dto";
import { AddBandMemberUseCase } from "@/modules/band-members/application/use-cases/add-band-member.use-case";
import { GetBandMemberUseCase } from "@/modules/band-members/application/use-cases/get-band-member.use-case";
import { ListBandMembersUseCase } from "@/modules/band-members/application/use-cases/list-band-members.use-case";
import { RemoveBandMemberUseCase } from "@/modules/band-members/application/use-cases/remove-band-member.use-case";
import { UpdateBandMemberUseCase } from "@/modules/band-members/application/use-cases/update-band-member.use-case";
import {
  ApiAddBandMember,
  ApiGetBandMember,
  ApiListBandMembers,
  ApiRemoveBandMember,
  ApiUpdateBandMember,
} from "@/modules/band-members/decorators/api-band-members.decorator";
import { UpdateBandMemberDto } from "@/modules/band-members/presentation/http/dto/update-band-member.dto";

/**
 * HTTP endpoints for a band's members, nested under a band and scoped to the
 * authenticated owner.
 */
@ApiTags("band-members")
@Controller("bands/:bandId/members")
@UseGuards(JwtAuthGuard)
export class BandMembersController {
  constructor(
    private readonly addBandMemberUseCase: AddBandMemberUseCase,
    private readonly listBandMembersUseCase: ListBandMembersUseCase,
    private readonly getBandMemberUseCase: GetBandMemberUseCase,
    private readonly updateBandMemberUseCase: UpdateBandMemberUseCase,
    private readonly removeBandMemberUseCase: RemoveBandMemberUseCase,
  ) {}

  /**
   * Adds a member to a band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The member payload.
   * @returns The created member.
   */
  @Post()
  @ApiAddBandMember()
  add(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: CreateBandMemberSeedDto,
  ): Promise<BandMemberView> {
    return this.addBandMemberUseCase.execute(actor, bandId, dto);
  }

  /**
   * Lists a band's members.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's members.
   */
  @Get()
  @ApiListBandMembers()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<BandMemberView[]> {
    return this.listBandMembersUseCase.execute(actor, bandId);
  }

  /**
   * Fetches one member of a band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @returns The member.
   */
  @Get(":memberId")
  @ApiGetBandMember()
  get(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
  ): Promise<BandMemberView> {
    return this.getBandMemberUseCase.execute(actor, bandId, memberId);
  }

  /**
   * Updates a member's editable fields.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @param dto - The editable fields to apply.
   * @returns The updated member.
   */
  @Patch(":memberId")
  @ApiUpdateBandMember()
  update(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
    @Body() dto: UpdateBandMemberDto,
  ): Promise<BandMemberView> {
    return this.updateBandMemberUseCase.execute(actor, bandId, memberId, dto);
  }

  /**
   * Removes a member from a band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param memberId - The member id.
   * @returns A promise that resolves once the member is removed.
   */
  @Delete(":memberId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveBandMember()
  remove(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
  ): Promise<void> {
    return this.removeBandMemberUseCase.execute(actor, bandId, memberId);
  }
}
