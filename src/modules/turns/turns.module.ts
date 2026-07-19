import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { EventsModule } from "@/modules/events/events.module";
import { AdvanceTurnUseCase } from "@/modules/turns/application/use-cases/advance-turn.use-case";
import { ListTurnsUseCase } from "@/modules/turns/application/use-cases/list-turns.use-case";
import { turnsProviders } from "@/modules/turns/infrastructure/persistence/providers/turns.providers";
import { TurnOrmEntity } from "@/modules/turns/infrastructure/persistence/typeorm/turn.orm-entity";
import { TurnsController } from "@/modules/turns/presentation/http/controllers/turns.controller";

/**
 * Turns module. Owns the band's in-game clock: advancing a turn (half a year)
 * runs the tick — passive event, member aging on a calendar-year rollover, a
 * chance of an active event — and records it. Imports {@link BandsModule} for
 * band state and {@link EventsModule} to generate the per-turn events.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([TurnOrmEntity]),
    BandsModule,
    EventsModule,
  ],
  controllers: [TurnsController],
  providers: [...turnsProviders, AdvanceTurnUseCase, ListTurnsUseCase],
})
export class TurnsModule {}
