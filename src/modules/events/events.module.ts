import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { GetActiveEventUseCase } from "@/modules/events/application/use-cases/get-active-event.use-case";
import { ListActiveEventsUseCase } from "@/modules/events/application/use-cases/list-active-events.use-case";
import { ResolveActiveEventUseCase } from "@/modules/events/application/use-cases/resolve-active-event.use-case";
import { activeEventsProviders } from "@/modules/events/infrastructure/persistence/providers/active-events.providers";
import { ActiveEventOrmEntity } from "@/modules/events/infrastructure/persistence/typeorm/active-event.orm-entity";
import { ActiveEventsController } from "@/modules/events/presentation/http/controllers/active-events.controller";

/**
 * Events module. Generates and resolves active events for a band. Imports
 * {@link BandsModule} to read band state and apply consequences (via
 * `BANDS_REPOSITORY`).
 */
@Module({
  imports: [TypeOrmModule.forFeature([ActiveEventOrmEntity]), BandsModule],
  controllers: [ActiveEventsController],
  providers: [
    ...activeEventsProviders,
    GenerateActiveEventUseCase,
    ListActiveEventsUseCase,
    GetActiveEventUseCase,
    ResolveActiveEventUseCase,
  ],
})
export class EventsModule {}
