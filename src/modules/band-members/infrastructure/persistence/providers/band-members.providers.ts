import { Provider } from "@nestjs/common";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { BandMembersTypeormRepository } from "@/modules/band-members/infrastructure/persistence/typeorm/band-members.typeorm.repository";

/**
 * DI providers binding {@link BAND_MEMBERS_REPOSITORY} to its TypeORM
 * implementation.
 */
export const bandMembersProviders: Provider[] = [
  BandMembersTypeormRepository,
  {
    provide: BAND_MEMBERS_REPOSITORY,
    useExisting: BandMembersTypeormRepository,
  },
];
