import { Provider } from "@nestjs/common";
import { PASSIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/passive-events.repository";
import { PassiveEventsTypeormRepository } from "@/modules/events/infrastructure/persistence/typeorm/passive-events.typeorm.repository";

/**
 * DI providers binding {@link PASSIVE_EVENTS_REPOSITORY} to its TypeORM
 * implementation.
 */
export const passiveEventsProviders: Provider[] = [
  PassiveEventsTypeormRepository,
  {
    provide: PASSIVE_EVENTS_REPOSITORY,
    useExisting: PassiveEventsTypeormRepository,
  },
];
