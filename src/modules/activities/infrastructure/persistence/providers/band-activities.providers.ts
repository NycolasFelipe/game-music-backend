import { Provider } from "@nestjs/common";
import { BAND_ACTIVITIES_REPOSITORY } from "@/modules/activities/domain/repositories/band-activities.repository";
import { BandActivitiesTypeormRepository } from "@/modules/activities/infrastructure/persistence/typeorm/band-activities.typeorm.repository";

/** Binds the band-activities repository token to its TypeORM implementation. */
export const bandActivitiesProviders: Provider[] = [
  BandActivitiesTypeormRepository,
  {
    provide: BAND_ACTIVITIES_REPOSITORY,
    useExisting: BandActivitiesTypeormRepository,
  },
];
