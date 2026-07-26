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
import { ActivityOptionsView } from "@/modules/activities/application/dto/activity-option.view";
import { ActivityResultView } from "@/modules/activities/application/dto/activity-result.view";
import { BandActivityView } from "@/modules/activities/application/dto/band-activity.view";
import { HoldActivityUseCase } from "@/modules/activities/application/use-cases/hold-activity.use-case";
import { ListActivityOptionsUseCase } from "@/modules/activities/application/use-cases/list-activity-options.use-case";
import { ListBandActivitiesUseCase } from "@/modules/activities/application/use-cases/list-band-activities.use-case";
import {
  ApiHoldActivity,
  ApiListActivityOptions,
  ApiListBandActivities,
} from "@/modules/activities/decorators/api-activities.decorator";
import { HoldActivityDto } from "@/modules/activities/presentation/http/dto/hold-activity.dto";

/**
 * HTTP endpoints for a band's confraternizações (ADR-0017). All routes require
 * authentication and are scoped to the band's owner.
 */
@ApiTags("activities")
@Controller("bands/:bandId/activities")
@UseGuards(JwtAuthGuard)
export class BandActivitiesController {
  constructor(
    private readonly holdActivityUseCase: HoldActivityUseCase,
    private readonly listActivityOptionsUseCase: ListActivityOptionsUseCase,
    private readonly listBandActivitiesUseCase: ListBandActivitiesUseCase,
  ) {}

  /**
   * Lists the activities on offer, priced for this band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The priced catalog and this turn's effect multiplier.
   */
  @Get("options")
  @ApiListActivityOptions()
  options(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<ActivityOptionsView> {
    return this.listActivityOptionsUseCase.execute(actor, bandId);
  }

  /**
   * Lists the activities the band has held, newest first.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's activity history.
   */
  @Get()
  @ApiListBandActivities()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<BandActivityView[]> {
    return this.listBandActivitiesUseCase.execute(actor, bandId);
  }

  /**
   * Holds an activity with the chosen guest list.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The activity and who goes.
   * @returns What the activity changed, and the trouble it raised.
   */
  @Post()
  @ApiHoldActivity()
  hold(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: HoldActivityDto,
  ): Promise<ActivityResultView> {
    return this.holdActivityUseCase.execute(actor, bandId, {
      activityId: dto.activityId,
      participantIds: dto.participantIds,
    });
  }
}
