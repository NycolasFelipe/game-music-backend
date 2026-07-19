import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateBandUseCase } from "@/modules/bands/application/use-cases/create-band.use-case";
import { DeleteBandUseCase } from "@/modules/bands/application/use-cases/delete-band.use-case";
import { GenerateBandNameUseCase } from "@/modules/bands/application/use-cases/generate-band-name.use-case";
import { GetBandFameUseCase } from "@/modules/bands/application/use-cases/get-band-fame.use-case";
import { GetBandUseCase } from "@/modules/bands/application/use-cases/get-band.use-case";
import { ListBandsUseCase } from "@/modules/bands/application/use-cases/list-bands.use-case";
import { ListBandRelationshipsUseCase } from "@/modules/bands/application/use-cases/list-band-relationships.use-case";
import { SetBandRelationshipLevelUseCase } from "@/modules/bands/application/use-cases/set-band-relationship-level.use-case";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import { bandsProviders } from "@/modules/bands/infrastructure/persistence/providers/bands.providers";
import { BandOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/band.orm-entity";
import { MemberRelationshipOrmEntity } from "@/modules/bands/infrastructure/persistence/typeorm/member-relationship.orm-entity";
import { BandsController } from "@/modules/bands/presentation/http/controllers/bands.controller";
import { BandRelationshipsController } from "@/modules/bands/presentation/http/controllers/band-relationships.controller";

/**
 * Bands module — the aggregate root. Owns band persistence, member
 * relationships, the band lifecycle use cases, and exposes the bands and
 * member-relationships repositories to other modules (e.g. band-members).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BandOrmEntity, MemberRelationshipOrmEntity]),
  ],
  controllers: [BandsController, BandRelationshipsController],
  providers: [
    ...bandsProviders,
    GenerateBandNameUseCase,
    CreateBandUseCase,
    ListBandsUseCase,
    GetBandUseCase,
    GetBandFameUseCase,
    DeleteBandUseCase,
    ListBandRelationshipsUseCase,
    SetBandRelationshipLevelUseCase,
  ],
  exports: [BANDS_REPOSITORY, MEMBER_RELATIONSHIPS_REPOSITORY],
})
export class BandsModule {}
