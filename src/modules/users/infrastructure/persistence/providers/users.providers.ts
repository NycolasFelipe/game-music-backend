import { Provider } from "@nestjs/common";
import { USERS_REPOSITORY } from "@/modules/users/domain/repositories/users.repository";
import { UsersTypeormRepository } from "@/modules/users/infrastructure/persistence/typeorm/users.typeorm.repository";

/**
 * DI providers binding the {@link USERS_REPOSITORY} token to its TypeORM
 * implementation via `useExisting`, so consumers depend only on the interface.
 */
export const usersProviders: Provider[] = [
  UsersTypeormRepository,
  {
    provide: USERS_REPOSITORY,
    useExisting: UsersTypeormRepository,
  },
];
