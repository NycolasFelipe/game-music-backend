import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { BandMemberCandidateView } from "@/modules/band-members/application/dto/band-member-candidate.view";
import { GenerateMemberCandidatesUseCase } from "@/modules/band-members/application/use-cases/generate-member-candidates.use-case";
import { ApiGenerateCandidates } from "@/modules/band-members/decorators/api-band-members.decorator";
import { GenerateCandidatesDto } from "@/modules/band-members/presentation/http/dto/generate-candidates.dto";

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
}
