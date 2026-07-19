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
import { BandView } from "@/modules/bands/application/dto/band.view";
import { BandWithMembersView } from "@/modules/bands/application/dto/band-with-members.view";
import { CreateBandUseCase } from "@/modules/bands/application/use-cases/create-band.use-case";
import { DeleteBandUseCase } from "@/modules/bands/application/use-cases/delete-band.use-case";
import {
  GenerateBandNameUseCase,
  type GeneratedBandName,
} from "@/modules/bands/application/use-cases/generate-band-name.use-case";
import { GetBandUseCase } from "@/modules/bands/application/use-cases/get-band.use-case";
import { ListBandsUseCase } from "@/modules/bands/application/use-cases/list-bands.use-case";
import {
  ApiCreateBand,
  ApiDeleteBand,
  ApiGenerateBandName,
  ApiGetBand,
  ApiListBands,
} from "@/modules/bands/decorators/api-bands.decorator";
import { CreateBandDto } from "@/modules/bands/presentation/http/dto/create-band.dto";

/**
 * HTTP endpoints for bands. All routes require authentication and are scoped
 * to the authenticated owner.
 */
@ApiTags("bands")
@Controller("bands")
@UseGuards(JwtAuthGuard)
export class BandsController {
  constructor(
    private readonly generateBandNameUseCase: GenerateBandNameUseCase,
    private readonly createBandUseCase: CreateBandUseCase,
    private readonly listBandsUseCase: ListBandsUseCase,
    private readonly getBandUseCase: GetBandUseCase,
    private readonly deleteBandUseCase: DeleteBandUseCase,
  ) {}

  /**
   * Generates a random band name suggestion.
   *
   * @returns The generated name.
   */
  @Get("generate-name")
  @ApiGenerateBandName()
  generateName(): GeneratedBandName {
    return this.generateBandNameUseCase.execute();
  }

  /**
   * Creates a band (with its initial members) owned by the actor.
   *
   * @param actor - The authenticated owner.
   * @param dto - The validated band + members payload.
   * @returns The created band with its members.
   */
  @Post()
  @ApiCreateBand()
  create(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Body() dto: CreateBandDto,
  ): Promise<BandWithMembersView> {
    return this.createBandUseCase.execute(actor, {
      name: dto.name,
      theme: dto.theme,
      origin: dto.origin,
      foundationYear: dto.foundationYear,
      members: dto.members,
    });
  }

  /**
   * Lists the authenticated owner's bands.
   *
   * @param actor - The authenticated owner.
   * @returns The owner's bands.
   */
  @Get()
  @ApiListBands()
  list(@CurrentUser() actor: AuthenticatedUserEntity): Promise<BandView[]> {
    return this.listBandsUseCase.execute(actor);
  }

  /**
   * Fetches one band (with its members) owned by the actor.
   *
   * @param actor - The authenticated owner.
   * @param id - The band id.
   * @returns The band with its members.
   */
  @Get(":id")
  @ApiGetBand()
  get(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BandWithMembersView> {
    return this.getBandUseCase.execute(actor, id);
  }

  /**
   * Deletes a band owned by the actor.
   *
   * @param actor - The authenticated owner.
   * @param id - The band id.
   * @returns A promise that resolves once the band is deleted.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteBand()
  remove(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.deleteBandUseCase.execute(actor, id);
  }
}
