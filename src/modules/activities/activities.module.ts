import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HoldActivityUseCase } from "@/modules/activities/application/use-cases/hold-activity.use-case";
import { ListActivityOptionsUseCase } from "@/modules/activities/application/use-cases/list-activity-options.use-case";
import { ListBandActivitiesUseCase } from "@/modules/activities/application/use-cases/list-band-activities.use-case";
import { BAND_ACTIVITIES_REPOSITORY } from "@/modules/activities/domain/repositories/band-activities.repository";
import { bandActivitiesProviders } from "@/modules/activities/infrastructure/persistence/providers/band-activities.providers";
import { BandActivityOrmEntity } from "@/modules/activities/infrastructure/persistence/typeorm/band-activity.orm-entity";
import { BandActivitiesController } from "@/modules/activities/presentation/http/controllers/band-activities.controller";
import { BandsModule } from "@/modules/bands/bands.module";
import { EventsModule } from "@/modules/events/events.module";

/**
 * Confraternizações: spending cash to keep the cast together (ADR-0017).
 * Depends on `BandsModule` to read and change band state, and on `EventsModule`
 * to raise the decision a night out can leave behind.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([BandActivityOrmEntity]),
    BandsModule,
    EventsModule,
  ],
  controllers: [BandActivitiesController],
  providers: [
    ...bandActivitiesProviders,
    HoldActivityUseCase,
    ListActivityOptionsUseCase,
    ListBandActivitiesUseCase,
  ],
  exports: [BAND_ACTIVITIES_REPOSITORY],
})
export class ActivitiesModule {}
