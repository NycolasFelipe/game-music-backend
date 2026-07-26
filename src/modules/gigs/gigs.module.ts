import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { ListGigsUseCase } from "@/modules/gigs/application/use-cases/list-gigs.use-case";
import { PlayGigUseCase } from "@/modules/gigs/application/use-cases/play-gig.use-case";
import { GIGS_REPOSITORY } from "@/modules/gigs/domain/repositories/gigs.repository";
import { gigsProviders } from "@/modules/gigs/infrastructure/persistence/providers/gigs.providers";
import { GigOrmEntity } from "@/modules/gigs/infrastructure/persistence/typeorm/gig.orm-entity";
import { BandGigsController } from "@/modules/gigs/presentation/http/controllers/band-gigs.controller";
import { GigsController } from "@/modules/gigs/presentation/http/controllers/gigs.controller";

/**
 * Live shows: the band's seasonal income on the road (ADR-0016). Depends on
 * `BandsModule` to read band state/members and apply the season's effects.
 */
@Module({
  imports: [TypeOrmModule.forFeature([GigOrmEntity]), BandsModule],
  controllers: [GigsController, BandGigsController],
  providers: [...gigsProviders, PlayGigUseCase, ListGigsUseCase],
  exports: [GIGS_REPOSITORY],
})
export class GigsModule {}
