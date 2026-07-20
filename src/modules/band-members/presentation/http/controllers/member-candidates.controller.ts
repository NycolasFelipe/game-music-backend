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
  ApiGenerateAvatar,
  ApiGenerateCandidates,
  ApiListCharacteristics,
  ApiListHappinessLevels,
  ApiListSkillDescriptions,
} from "@/modules/band-members/decorators/api-band-members.decorator";
import { CHARACTERISTICS } from "@/modules/band-members/domain/data/characteristics";
import { HAPPINESS_LEVELS } from "@/modules/band-members/domain/data/happiness-levels";
import {
  SKILL_DESCRIPTIONS,
  type SkillLevelDescription,
} from "@/modules/band-members/domain/data/skill-descriptions";
import { generateAvatar } from "@/modules/band-members/domain/generation/character.generator";
import { GenerateAvatarDto } from "@/modules/band-members/presentation/http/dto/generate-avatar.dto";
import { GenerateCandidatesDto } from "@/modules/band-members/presentation/http/dto/generate-candidates.dto";
import { CharacteristicView } from "@/modules/band-members/presentation/http/dto/characteristic.view";
import { HappinessLevelView } from "@/modules/band-members/presentation/http/dto/happiness-level.view";

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
   * Generates a single avatar emoji for a gender (to regenerate one member's
   * appearance without changing anything else).
   *
   * @param dto - The gender to generate an avatar for.
   * @returns The generated avatar emoji.
   */
  @Post("avatar")
  @HttpCode(HttpStatus.OK)
  @ApiGenerateAvatar()
  avatar(@Body() dto: GenerateAvatarDto): { avatar: string } {
    return { avatar: generateAvatar(dto.gender) };
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
      rarity: c.rarity,
    }));
  }

  /**
   * Lists the per-skill level descriptions (flavor text per instrument level),
   * so clients can show them without duplicating the game data.
   *
   * @returns The descriptions keyed by skill.
   */
  @Get("skill-descriptions")
  @ApiListSkillDescriptions()
  skillDescriptions(): Record<string, SkillLevelDescription[]> {
    return SKILL_DESCRIPTIONS;
  }

  /**
   * Lists the happiness-level display metadata (emoji, name, description).
   *
   * @returns The happiness levels (-5..5) with display data.
   */
  @Get("happiness-levels")
  @ApiListHappinessLevels()
  happinessLevels(): HappinessLevelView[] {
    return HAPPINESS_LEVELS;
  }
}
