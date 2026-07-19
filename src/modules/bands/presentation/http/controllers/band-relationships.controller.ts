import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { MemberRelationshipView } from "@/modules/bands/application/dto/member-relationship.view";
import { ListBandRelationshipsUseCase } from "@/modules/bands/application/use-cases/list-band-relationships.use-case";
import { SetBandRelationshipLevelUseCase } from "@/modules/bands/application/use-cases/set-band-relationship-level.use-case";
import {
  ApiListBandRelationships,
  ApiSetBandRelationshipLevel,
} from "@/modules/bands/decorators/api-band-relationships.decorator";
import { SetRelationshipLevelDto } from "@/modules/bands/presentation/http/dto/set-relationship-level.dto";

/**
 * HTTP endpoints for a band's member relationships, nested under a band and
 * scoped to the authenticated owner.
 */
@ApiTags("band-relationships")
@Controller("bands/:bandId/relationships")
@UseGuards(JwtAuthGuard)
export class BandRelationshipsController {
  constructor(
    private readonly listBandRelationshipsUseCase: ListBandRelationshipsUseCase,
    private readonly setBandRelationshipLevelUseCase: SetBandRelationshipLevelUseCase,
  ) {}

  /**
   * Lists a band's relationships.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's relationships.
   */
  @Get()
  @ApiListBandRelationships()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<MemberRelationshipView[]> {
    return this.listBandRelationshipsUseCase.execute(actor, bandId);
  }

  /**
   * Sets (upserts) the level between two members.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The two member ids and the new level.
   * @returns The updated relationship.
   */
  @Put()
  @ApiSetBandRelationshipLevel()
  setLevel(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: SetRelationshipLevelDto,
  ): Promise<MemberRelationshipView> {
    return this.setBandRelationshipLevelUseCase.execute(actor, bandId, {
      memberId1: dto.memberId1,
      memberId2: dto.memberId2,
      level: dto.level,
    });
  }
}
