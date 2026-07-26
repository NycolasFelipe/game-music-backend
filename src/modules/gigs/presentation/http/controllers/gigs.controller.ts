import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { ApiListGigTypes } from "@/modules/gigs/decorators/api-gigs.decorator";
import { GIG_TYPES, type GigType } from "@/modules/gigs/domain/data/gig-types";

/**
 * HTTP endpoints for live-show metadata (not band-scoped). All routes require
 * authentication.
 */
@ApiTags("gigs")
@Controller("gigs")
@UseGuards(JwtAuthGuard)
export class GigsController {
  /**
   * Lists the live-circuit catalog.
   *
   * @returns The circuits with their fame gate and economics.
   */
  @Get("types")
  @ApiListGigTypes()
  types(): GigType[] {
    return GIG_TYPES;
  }
}
