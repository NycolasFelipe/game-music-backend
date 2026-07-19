import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { bandsProviders } from "@/modules/bands/infrastructure/persistence/providers/bands.providers";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";

/**
 * Bands module. Owns band persistence and exposes the bands repository
 * (via {@link BANDS_REPOSITORY}) to other modules such as band-members.
 */
@Module({
  imports: [TypeOrmModule.forFeature([BandOrmEntity])],
  providers: [...bandsProviders],
  exports: [BANDS_REPOSITORY],
})
export class BandsModule {}
