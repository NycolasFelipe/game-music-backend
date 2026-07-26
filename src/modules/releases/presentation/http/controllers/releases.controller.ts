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
import { BAND_THEMES } from "@/modules/bands/domain/constants/band.constant";
import { THEME_LABELS } from "@/modules/bands/presentation/http/constants/band-labels.constant";
import {
  GenerateReleaseConceptUseCase,
  type GeneratedReleaseConcept,
} from "@/modules/releases/application/use-cases/generate-release-concept.use-case";
import {
  GenerateReleaseTitleUseCase,
  type GeneratedReleaseTitles,
} from "@/modules/releases/application/use-cases/generate-release-title.use-case";
import {
  BUDGET_TIERS,
  type BudgetTier,
} from "@/modules/releases/domain/data/budget-tiers";
import {
  RELEASE_FORMATS,
  type ReleaseFormat,
} from "@/modules/releases/domain/data/release-formats";
import {
  QUALITY_TIERS,
  type QualityTier,
} from "@/modules/releases/domain/data/quality-tiers";
import {
  REVIEW_TIERS,
  type ReviewTier,
} from "@/modules/releases/domain/data/review-tiers";
import { genreProfileFor } from "@/modules/releases/domain/data/release-genre-profiles";
import {
  ApiGenerateReleaseConcept,
  ApiGenerateReleaseTitle,
  ApiListGenreProfiles,
  ApiListBudgetTiers,
  ApiListQualityTiers,
  ApiListReleaseFormats,
  ApiListReviewTiers,
} from "@/modules/releases/decorators/api-releases.decorator";
import { GenerateReleaseConceptDto } from "@/modules/releases/presentation/http/dto/generate-release-concept.dto";
import { GenreProfileView } from "@/modules/releases/presentation/http/dto/genre-profile.view";
import { GenerateReleaseTitleDto } from "@/modules/releases/presentation/http/dto/generate-release-title.dto";

/**
 * HTTP endpoints for release metadata and generators (not band-scoped). All
 * routes require authentication.
 */
@ApiTags("releases")
@Controller("releases")
@UseGuards(JwtAuthGuard)
export class ReleasesController {
  constructor(
    private readonly generateReleaseTitleUseCase: GenerateReleaseTitleUseCase,
    private readonly generateReleaseConceptUseCase: GenerateReleaseConceptUseCase,
  ) {}

  /**
   * Lists the release-format catalog.
   *
   * @returns The formats with their economics.
   */
  @Get("formats")
  @ApiListReleaseFormats()
  formats(): ReleaseFormat[] {
    return RELEASE_FORMATS;
  }

  /**
   * Lists the budget-tier catalog.
   *
   * @returns The budget tiers.
   */
  @Get("budget-tiers")
  @ApiListBudgetTiers()
  budgetTiers(): BudgetTier[] {
    return BUDGET_TIERS;
  }

  /**
   * Lists the quality-tier ladder (labels/emoji for a finished work).
   *
   * @returns The quality tiers.
   */
  @Get("quality-tiers")
  @ApiListQualityTiers()
  qualityTiers(): QualityTier[] {
    return QUALITY_TIERS;
  }

  /**
   * Lists the review-tier ladder (labels/emoji for critic/public scores).
   *
   * @returns The review tiers.
   */
  @Get("review-tiers")
  @ApiListReviewTiers()
  reviewTiers(): ReviewTier[] {
    return REVIEW_TIERS;
  }

  /**
   * Lists the skill-weight profile of every style: how much each aspect matters
   * to a work of that style. Lets the client show what a style demands and
   * forecast a draft's technical potential.
   *
   * @returns One profile per style, with its display label.
   */
  @Get("genre-profiles")
  @ApiListGenreProfiles()
  genreProfiles(): GenreProfileView[] {
    return BAND_THEMES.map((style) => ({
      style,
      label: THEME_LABELS[style],
      weights: genreProfileFor(style),
    }));
  }

  /**
   * Generates release-title suggestions.
   *
   * @param dto - Language/count options.
   * @returns The generated titles.
   */
  @Post("generate-title")
  @HttpCode(HttpStatus.OK)
  @ApiGenerateReleaseTitle()
  generateTitle(@Body() dto: GenerateReleaseTitleDto): GeneratedReleaseTitles {
    return this.generateReleaseTitleUseCase.execute(dto);
  }

  /**
   * Generates a concept-album description.
   *
   * @param dto - Title/style seeds.
   * @returns The generated concept.
   */
  @Post("generate-concept")
  @HttpCode(HttpStatus.OK)
  @ApiGenerateReleaseConcept()
  generateConcept(
    @Body() dto: GenerateReleaseConceptDto,
  ): GeneratedReleaseConcept {
    return this.generateReleaseConceptUseCase.execute({
      title: dto.title,
      styleLabel: dto.style ? THEME_LABELS[dto.style] : undefined,
    });
  }
}
