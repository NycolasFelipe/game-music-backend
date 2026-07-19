import { Provider } from "@nestjs/common";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { BandsTypeormRepository } from "@/modules/bands/infrastructure/persistence/typeorm/bands.typeorm.repository";

/**
 * DI providers binding {@link BANDS_REPOSITORY} to its TypeORM implementation.
 */
export const bandsProviders: Provider[] = [
  BandsTypeormRepository,
  {
    provide: BANDS_REPOSITORY,
    useExisting: BandsTypeormRepository,
  },
];
