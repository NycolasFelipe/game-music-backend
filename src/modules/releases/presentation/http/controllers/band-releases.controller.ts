import {
  Body,
  Controller,
  Delete,
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
import { ReleaseView } from "@/modules/releases/application/dto/release.view";
import { ReleaseWithEventsView } from "@/modules/releases/application/dto/release-with-events.view";
import { CancelReleaseUseCase } from "@/modules/releases/application/use-cases/cancel-release.use-case";
import { FinalizeReleaseUseCase } from "@/modules/releases/application/use-cases/finalize-release.use-case";
import { GetReleaseUseCase } from "@/modules/releases/application/use-cases/get-release.use-case";
import { ListReleasesUseCase } from "@/modules/releases/application/use-cases/list-releases.use-case";
import { ResolveCreationEventUseCase } from "@/modules/releases/application/use-cases/resolve-creation-event.use-case";
import { StartReleaseUseCase } from "@/modules/releases/application/use-cases/start-release.use-case";
import {
  ApiCancelRelease,
  ApiFinalizeRelease,
  ApiGetRelease,
  ApiListReleases,
  ApiResolveCreationEvent,
  ApiStartRelease,
} from "@/modules/releases/decorators/api-releases.decorator";
import { ResolveCreationEventDto } from "@/modules/releases/presentation/http/dto/resolve-creation-event.dto";
import { StartReleaseDto } from "@/modules/releases/presentation/http/dto/start-release.dto";

/**
 * HTTP endpoints for a band's releases (discography + creation lifecycle). All
 * routes require authentication and are scoped to the band's owner.
 */
@ApiTags("releases")
@Controller("bands/:bandId/releases")
@UseGuards(JwtAuthGuard)
export class BandReleasesController {
  constructor(
    private readonly listReleasesUseCase: ListReleasesUseCase,
    private readonly getReleaseUseCase: GetReleaseUseCase,
    private readonly startReleaseUseCase: StartReleaseUseCase,
    private readonly resolveCreationEventUseCase: ResolveCreationEventUseCase,
    private readonly finalizeReleaseUseCase: FinalizeReleaseUseCase,
    private readonly cancelReleaseUseCase: CancelReleaseUseCase,
  ) {}

  /**
   * Lists the band's discography.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's releases.
   */
  @Get()
  @ApiListReleases()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<ReleaseView[]> {
    return this.listReleasesUseCase.execute(actor, bandId);
  }

  /**
   * Fetches one release with its creation events (for the creation flow).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param id - The release id.
   * @returns The release with its creation events.
   */
  @Get(":id")
  @ApiGetRelease()
  get(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ReleaseWithEventsView> {
    return this.getReleaseUseCase.execute(actor, bandId, id);
  }

  /**
   * Starts a release draft for the band.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param dto - The validated draft payload.
   * @returns The created draft.
   */
  @Post()
  @ApiStartRelease()
  start(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Body() dto: StartReleaseDto,
  ): Promise<ReleaseView> {
    return this.startReleaseUseCase.execute(actor, bandId, {
      title: dto.title,
      concept: dto.concept ?? "",
      style: dto.style,
      format: dto.format,
      budgetTier: dto.budgetTier,
      credits: dto.credits,
    });
  }

  /**
   * Resolves one creation event of a draft.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param id - The release id.
   * @param eventId - The creation-event id.
   * @param dto - The chosen option.
   * @returns The release with its updated events.
   */
  @Post(":id/creation-events/:eventId/resolve")
  @HttpCode(HttpStatus.OK)
  @ApiResolveCreationEvent()
  resolveCreationEvent(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Body() dto: ResolveCreationEventDto,
  ): Promise<ReleaseWithEventsView> {
    return this.resolveCreationEventUseCase.execute(
      actor,
      bandId,
      id,
      eventId,
      dto.optionId,
    );
  }

  /**
   * Finalizes and launches a draft.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param id - The release id.
   * @returns The launched release.
   */
  @Post(":id/finalize")
  @HttpCode(HttpStatus.OK)
  @ApiFinalizeRelease()
  finalize(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ReleaseView> {
    return this.finalizeReleaseUseCase.execute(actor, bandId, id);
  }

  /**
   * Discards a draft.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @param id - The release id.
   * @returns A promise that resolves once discarded.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCancelRelease()
  cancel(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.cancelReleaseUseCase.execute(actor, bandId, id);
  }
}
