import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { GenerateReleaseConceptUseCase } from "@/modules/releases/application/use-cases/generate-release-concept.use-case";
import { GenerateReleaseTitleUseCase } from "@/modules/releases/application/use-cases/generate-release-title.use-case";
import { AccrueReleaseRoyaltiesUseCase } from "@/modules/releases/application/use-cases/accrue-release-royalties.use-case";
import { CancelReleaseUseCase } from "@/modules/releases/application/use-cases/cancel-release.use-case";
import { FinalizeReleaseUseCase } from "@/modules/releases/application/use-cases/finalize-release.use-case";
import { GetReleaseUseCase } from "@/modules/releases/application/use-cases/get-release.use-case";
import { ListReleasesUseCase } from "@/modules/releases/application/use-cases/list-releases.use-case";
import { ResolveCreationEventUseCase } from "@/modules/releases/application/use-cases/resolve-creation-event.use-case";
import { StartReleaseUseCase } from "@/modules/releases/application/use-cases/start-release.use-case";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import { releasesProviders } from "@/modules/releases/infrastructure/persistence/providers/releases.providers";
import { ReleaseCreationEventOrmEntity } from "@/modules/releases/infrastructure/persistence/typeorm/release-creation-event.orm-entity";
import { ReleaseOrmEntity } from "@/modules/releases/infrastructure/persistence/typeorm/release.orm-entity";
import { BandReleasesController } from "@/modules/releases/presentation/http/controllers/band-releases.controller";
import { ReleasesController } from "@/modules/releases/presentation/http/controllers/releases.controller";

/**
 * Musical works (releases). Exposes the format/budget catalogs and title/concept
 * generators, plus a band's discography and the draft → launch lifecycle
 * (ADR-0008). Depends on `BandsModule` to read band state/members and apply
 * atomic state changes. Exports its repository token for the turns module (the
 * royalty tail is accrued during the turn tick).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ReleaseOrmEntity, ReleaseCreationEventOrmEntity]),
    BandsModule,
  ],
  controllers: [ReleasesController, BandReleasesController],
  providers: [
    ...releasesProviders,
    GenerateReleaseTitleUseCase,
    GenerateReleaseConceptUseCase,
    ListReleasesUseCase,
    GetReleaseUseCase,
    StartReleaseUseCase,
    ResolveCreationEventUseCase,
    FinalizeReleaseUseCase,
    CancelReleaseUseCase,
    AccrueReleaseRoyaltiesUseCase,
  ],
  exports: [RELEASES_REPOSITORY, AccrueReleaseRoyaltiesUseCase],
})
export class ReleasesModule {}
