import { Provider } from "@nestjs/common";
import { RELEASES_REPOSITORY } from "@/modules/releases/domain/repositories/releases.repository";
import { ReleasesTypeormRepository } from "@/modules/releases/infrastructure/persistence/typeorm/releases.typeorm.repository";

/** Binds the releases repository token to its TypeORM implementation. */
export const releasesProviders: Provider[] = [
  ReleasesTypeormRepository,
  { provide: RELEASES_REPOSITORY, useExisting: ReleasesTypeormRepository },
];
