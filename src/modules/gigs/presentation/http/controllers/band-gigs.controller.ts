import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { GigResultView } from "@/modules/gigs/application/dto/gig-result.view";
import { GigView } from "@/modules/gigs/application/dto/gig.view";
import { ListGigsUseCase } from "@/modules/gigs/application/use-cases/list-gigs.use-case";
import { PlayGigUseCase } from "@/modules/gigs/application/use-cases/play-gig.use-case";
import {
  ApiListGigs,
  ApiPlayGig,
} from "@/modules/gigs/decorators/api-gigs.decorator";
import { PlayGigDto } from "@/modules/gigs/presentation/http/dto/play-gig.dto";

/**
 * HTTP endpoints for a band's live seasons (ADR-0016). All routes require
 * authentication and are scoped to the band's owner.
 */
@ApiTags("gigs")
@Controller("bands/:bandId/gigs")
@UseGuards(JwtAuthGuard)
export class BandGigsController {
  constructor(
    private readonly playGigUseCase: PlayGigUseCase,
    private readonly listGigsUseCase: ListGigsUseCase,
  ) {}

  /**
   * Lists the band's played seasons, newest first.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's gig history.
   */
  @Get()
  @ApiListGigs()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<GigView[]> {
    return this.listGigsUseCase.execute(actor, bandId);
  }

  /**
   * Plays the band's live season on a circuit.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The circuit to play.
   * @returns The recorded season and the band's new state.
   */
  @Post()
  @ApiPlayGig()
  play(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: PlayGigDto,
  ): Promise<GigResultView> {
    return this.playGigUseCase.execute(actor, bandId, {
      gigTypeId: dto.gigTypeId,
    });
  }
}
