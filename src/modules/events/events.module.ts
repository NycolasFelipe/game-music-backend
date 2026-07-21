import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { GenerateActiveEventUseCase } from "@/modules/events/application/use-cases/generate-active-event.use-case";
import { GeneratePassiveEventsUseCase } from "@/modules/events/application/use-cases/generate-passive-events.use-case";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import { GetActiveEventUseCase } from "@/modules/events/application/use-cases/get-active-event.use-case";
import { ListActiveEventsUseCase } from "@/modules/events/application/use-cases/list-active-events.use-case";
import { ListPassiveEventsUseCase } from "@/modules/events/application/use-cases/list-passive-events.use-case";
import { RecordMemberDeparturesUseCase } from "@/modules/events/application/use-cases/record-member-departures.use-case";
import { ResolveActiveEventUseCase } from "@/modules/events/application/use-cases/resolve-active-event.use-case";
import { activeEventsProviders } from "@/modules/events/infrastructure/persistence/providers/active-events.providers";
import { passiveEventsProviders } from "@/modules/events/infrastructure/persistence/providers/passive-events.providers";
import { ActiveEventOrmEntity } from "@/modules/events/infrastructure/persistence/typeorm/active-event.orm-entity";
import { PassiveEventOrmEntity } from "@/modules/events/infrastructure/persistence/typeorm/passive-event.orm-entity";
import { ActiveEventsController } from "@/modules/events/presentation/http/controllers/active-events.controller";
import { PassiveEventsController } from "@/modules/events/presentation/http/controllers/passive-events.controller";

/**
 * Events module. Generates/resolves active events and generates passive
 * (timeline) events for a band. Imports {@link BandsModule} to read band state
 * and apply consequences (via `BANDS_REPOSITORY`).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveEventOrmEntity, PassiveEventOrmEntity]),
    BandsModule,
  ],
  controllers: [ActiveEventsController, PassiveEventsController],
  providers: [
    ...activeEventsProviders,
    ...passiveEventsProviders,
    GenerateActiveEventUseCase,
    ListActiveEventsUseCase,
    GetActiveEventUseCase,
    ResolveActiveEventUseCase,
    GeneratePassiveEventsUseCase,
    ListPassiveEventsUseCase,
    RecordMemberDeparturesUseCase,
  ],
  exports: [
    // Consumed by the turns module to run the per-turn event tick.
    GenerateActiveEventUseCase,
    GeneratePassiveEventsUseCase,
    RecordMemberDeparturesUseCase,
    ACTIVE_EVENTS_REPOSITORY,
  ],
})
export class EventsModule {}
