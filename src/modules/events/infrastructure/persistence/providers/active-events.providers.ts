import { Provider } from "@nestjs/common";
import { ACTIVE_EVENTS_REPOSITORY } from "@/modules/events/domain/repositories/active-events.repository";
import { ActiveEventsTypeormRepository } from "@/modules/events/infrastructure/persistence/typeorm/active-events.typeorm.repository";

/**
 * DI providers binding {@link ACTIVE_EVENTS_REPOSITORY} to its TypeORM
 * implementation.
 */
export const activeEventsProviders: Provider[] = [
  ActiveEventsTypeormRepository,
  {
    provide: ACTIVE_EVENTS_REPOSITORY,
    useExisting: ActiveEventsTypeormRepository,
  },
];
