import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { BandMemberCandidateView } from "@/modules/band-members/application/dto/band-member-candidate.view";
import { GenerateMemberCandidatesUseCase } from "@/modules/band-members/application/use-cases/generate-member-candidates.use-case";
import {
  ApiGenerateCandidates,
  ApiListCharacteristics,
} from "@/modules/band-members/decorators/api-band-members.decorator";
import { CHARACTERISTICS } from "@/modules/band-members/domain/data/characteristics";
import { GenerateCandidatesDto } from "@/modules/band-members/presentation/http/dto/generate-candidates.dto";
import { CharacteristicView } from "@/modules/band-members/presentation/http/dto/characteristic.view";

/**
 * HTTP endpoint for generating (stateless) member candidates.
 */
@ApiTags("band-members")
@Controller("band-members")
@UseGuards(JwtAuthGuard)
export class MemberCandidatesController {
  constructor(
    private readonly generateMemberCandidatesUseCase: GenerateMemberCandidatesUseCase,
  ) {}

  /**
   * Generates member candidates (not persisted).
   *
   * @param dto - The optional desired candidate count.
   * @returns The generated candidates.
   */
  @Post("candidates")
  @HttpCode(HttpStatus.OK)
  @ApiGenerateCandidates()
  generate(@Body() dto: GenerateCandidatesDto): BandMemberCandidateView[] {
    return this.generateMemberCandidatesUseCase.execute(dto.count);
  }

  /**
   * Lists the characteristic (trait) catalog with display data, so clients can
   * render trait names/descriptions without duplicating the game data.
   *
   * @returns The trait catalog.
   */
  @Get("characteristics")
  @ApiListCharacteristics()
  characteristics(): CharacteristicView[] {
    return Object.values(CHARACTERISTICS).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category,
    }));
  }
}
