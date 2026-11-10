import {
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
import { AdvanceTurnView } from "@/modules/turns/application/dto/advance-turn.view";
import { TurnPanelView } from "@/modules/turns/application/dto/turn-panel.view";
import { TurnView } from "@/modules/turns/application/dto/turn.view";
import { AdvanceTurnUseCase } from "@/modules/turns/application/use-cases/advance-turn.use-case";
import { GetTurnPanelUseCase } from "@/modules/turns/application/use-cases/get-turn-panel.use-case";
import { ListTurnsUseCase } from "@/modules/turns/application/use-cases/list-turns.use-case";
import {
  ApiAdvanceTurn,
  ApiGetTurnPanel,
  ApiListTurns,
} from "@/modules/turns/decorators/api-turns.decorator";

/**
 * HTTP endpoints for a band's turns (its in-game clock), nested under a band
 * and scoped to the authenticated owner.
 */
@ApiTags("turns")
@Controller("bands/:bandId/turns")
@UseGuards(JwtAuthGuard)
export class TurnsController {
  constructor(
    private readonly advanceTurnUseCase: AdvanceTurnUseCase,
    private readonly listTurnsUseCase: ListTurnsUseCase,
    private readonly getTurnPanelUseCase: GetTurnPanelUseCase,
  ) {}

  /**
   * Advances the band's clock by one turn.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The new clock and any events produced this turn.
   */
  @Post("advance")
  @HttpCode(HttpStatus.OK)
  @ApiAdvanceTurn()
  advance(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<AdvanceTurnView> {
    return this.advanceTurnUseCase.execute(actor, bandId);
  }

  /**
   * Lists the band's recorded turns (its timeline).
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's recorded turns, oldest first.
   */
  @Get()
  @ApiListTurns()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<TurnView[]> {
    return this.listTurnsUseCase.execute(actor, bandId);
  }

  /**
   * Reads the turn panel: pending decisions, live-season previews, the
   * get-together slot, the studio and the forecast of the next advance.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The turn panel (ADR-0022).
   */
  @Get("panel")
  @ApiGetTurnPanel()
  panel(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<TurnPanelView> {
    return this.getTurnPanelUseCase.execute(actor, bandId);
  }
}
