import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateBandUseCase } from "@/modules/bands/application/use-cases/create-band.use-case";
import { DeleteBandUseCase } from "@/modules/bands/application/use-cases/delete-band.use-case";
import { GenerateBandNameUseCase } from "@/modules/bands/application/use-cases/generate-band-name.use-case";
import { GetBandUseCase } from "@/modules/bands/application/use-cases/get-band.use-case";
import { ListBandsUseCase } from "@/modules/bands/application/use-cases/list-bands.use-case";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { bandsProviders } from "@/modules/bands/infrastructure/persistence/providers/bands.providers";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";
import { BandsController } from "@/modules/bands/presentation/http/controllers/bands.controller";

/**
 * Bands module. Owns band persistence (aggregate root), the band lifecycle use
 * cases, and exposes the bands repository (via {@link BANDS_REPOSITORY}) to
 * other modules such as band-members.
 */
@Module({
  imports: [TypeOrmModule.forFeature([BandOrmEntity])],
  controllers: [BandsController],
  providers: [
    ...bandsProviders,
    GenerateBandNameUseCase,
    CreateBandUseCase,
    ListBandsUseCase,
    GetBandUseCase,
    DeleteBandUseCase,
  ],
  exports: [BANDS_REPOSITORY],
})
export class BandsModule {}
