import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { ActiveEventView } from "@/modules/events/application/dto/active-event.view";
import { EventResolutionView } from "@/modules/events/application/dto/event-resolution.view";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { GetActiveEventUseCase } from "@/modules/events/application/use-cases/get-active-event.use-case";
import { ListActiveEventsUseCase } from "@/modules/events/application/use-cases/list-active-events.use-case";
import { ResolveActiveEventUseCase } from "@/modules/events/application/use-cases/resolve-active-event.use-case";
import {
  ApiGenerateActiveEvent,
  ApiGetActiveEvent,
  ApiListActiveEvents,
  ApiResolveActiveEvent,
} from "@/modules/events/decorators/api-active-events.decorator";
import { GenerateActiveEventDto } from "@/modules/events/presentation/http/dto/generate-active-event.dto";
import { ResolveActiveEventDto } from "@/modules/events/presentation/http/dto/resolve-active-event.dto";

/**
 * HTTP endpoints for a band's active events, nested under a band and scoped to
 * the authenticated owner.
 */
@ApiTags("events")
@Controller("bands/:bandId/events")
@UseGuards(JwtAuthGuard)
export class ActiveEventsController {
  constructor(
    private readonly generateActiveEventUseCase: GenerateActiveEventUseCase,
    private readonly listActiveEventsUseCase: ListActiveEventsUseCase,
    private readonly getActiveEventUseCase: GetActiveEventUseCase,
    private readonly resolveActiveEventUseCase: ResolveActiveEventUseCase,
  ) {}

  /**
   * Generates an eligible active event for the band at the given year.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The current year.
   * @returns The generated (pending) event.
   */
  @Post()
  @ApiGenerateActiveEvent()
  generate(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: GenerateActiveEventDto,
  ): Promise<ActiveEventView> {
    return this.generateActiveEventUseCase.execute(actor, bandId, dto.year);
  }

  /**
   * Lists the band's active events.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's events.
   */
  @Get()
  @ApiListActiveEvents()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<ActiveEventView[]> {
    return this.listActiveEventsUseCase.execute(actor, bandId);
  }

  /**
   * Fetches one active event of the band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param eventId - The event id.
   * @returns The event.
   */
  @Get(":eventId")
  @ApiGetActiveEvent()
  get(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("eventId", ParseUUIDPipe) eventId: string,
  ): Promise<ActiveEventView> {
    return this.getActiveEventUseCase.execute(actor, bandId, eventId);
  }

  /**
   * Resolves an event by choosing an option, applying its consequences.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param eventId - The event id.
   * @param dto - The chosen option id.
   * @returns The resolved event, the outcome and the applied changes.
   */
  @Post(":eventId/resolve")
  @HttpCode(HttpStatus.OK)
  @ApiResolveActiveEvent()
  resolve(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Body() dto: ResolveActiveEventDto,
  ): Promise<EventResolutionView> {
    return this.resolveActiveEventUseCase.execute(
      actor,
      bandId,
      eventId,
      dto.optionId,
    );
  }
}
