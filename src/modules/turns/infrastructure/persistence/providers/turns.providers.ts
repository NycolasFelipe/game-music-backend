import { Provider } from "@nestjs/common";
import { TURNS_REPOSITORY } from "@/modules/turns/domain/repositories/turns.repository";
import { TurnsTypeormRepository } from "@/modules/turns/infrastructure/persistence/typeorm/turns.typeorm.repository";

/**
 * DI providers binding the turns repository token to its TypeORM implementation.
 */
export const turnsProviders: Provider[] = [
  TurnsTypeormRepository,
  { provide: TURNS_REPOSITORY, useExisting: TurnsTypeormRepository },
];
