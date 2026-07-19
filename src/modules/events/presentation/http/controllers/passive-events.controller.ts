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
import { PassiveEventView } from "@/modules/events/application/dto/passive-event.view";
import { GeneratePassiveEventsUseCase } from "@/modules/events/application/use-cases/generate-passive-events.use-case";
import { ListPassiveEventsUseCase } from "@/modules/events/application/use-cases/list-passive-events.use-case";
import {
  ApiGeneratePassiveEvents,
  ApiListPassiveEvents,
} from "@/modules/events/decorators/api-passive-events.decorator";
import { GeneratePassiveEventsDto } from "@/modules/events/presentation/http/dto/generate-passive-events.dto";

/**
 * HTTP endpoints for a band's passive (timeline) events, nested under a band
 * and scoped to the authenticated owner.
 */
@ApiTags("events")
@Controller("bands/:bandId/passive-events")
@UseGuards(JwtAuthGuard)
export class PassiveEventsController {
  constructor(
    private readonly generatePassiveEventsUseCase: GeneratePassiveEventsUseCase,
    private readonly listPassiveEventsUseCase: ListPassiveEventsUseCase,
  ) {}

  /**
   * Generates passive events for the band at the given year.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The year and optional count.
   * @returns The generated passive events.
   */
  @Post()
  @ApiGeneratePassiveEvents()
  generate(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: GeneratePassiveEventsDto,
  ): Promise<PassiveEventView[]> {
    return this.generatePassiveEventsUseCase.execute(
      actor,
      bandId,
      dto.year,
      dto.count ?? 1,
    );
  }

  /**
   * Lists the band's passive events.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's passive events.
   */
  @Get()
  @ApiListPassiveEvents()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<PassiveEventView[]> {
    return this.listPassiveEventsUseCase.execute(actor, bandId);
  }
}
