import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { FormerMemberView } from "@/modules/band-members/application/dto/former-member.view";
import { ListFormerMembersUseCase } from "@/modules/band-members/application/use-cases/list-former-members.use-case";
import { ApiListFormerMembers } from "@/modules/band-members/decorators/api-band-members.decorator";

/**
 * HTTP endpoints for a band's former (departed) members, nested under a band and
 * scoped to the authenticated owner.
 */
@ApiTags("band-members")
@Controller("bands/:bandId/former-members")
@UseGuards(JwtAuthGuard)
export class FormerMembersController {
  constructor(
    private readonly listFormerMembersUseCase: ListFormerMembersUseCase,
  ) {}

  /**
   * Lists a band's former members.
   *
   * @param actor - The authenticated owner.
   * @param bandId - The band id.
   * @returns The band's former members (newest first).
   */
  @Get()
  @ApiListFormerMembers()
  list(
    @CurrentUser() actor: AuthenticatedUserEntity,
    @Param("bandId", ParseUUIDPipe) bandId: string,
  ): Promise<FormerMemberView[]> {
    return this.listFormerMembersUseCase.execute(actor, bandId);
  }
}
