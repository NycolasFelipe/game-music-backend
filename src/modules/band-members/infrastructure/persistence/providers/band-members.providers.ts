import { Provider } from "@nestjs/common";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { FORMER_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/former-members.repository";
import { BandMembersTypeormRepository } from "@/modules/band-members/infrastructure/persistence/typeorm/band-members.typeorm.repository";
import { FormerMembersTypeormRepository } from "@/modules/band-members/infrastructure/persistence/typeorm/former-members.typeorm.repository";

/**
 * DI providers binding the band-members repositories to their TypeORM
 * implementations.
 */
export const bandMembersProviders: Provider[] = [
  BandMembersTypeormRepository,
  {
    provide: BAND_MEMBERS_REPOSITORY,
    useExisting: BandMembersTypeormRepository,
  },
  FormerMembersTypeormRepository,
  {
    provide: FORMER_MEMBERS_REPOSITORY,
    useExisting: FormerMembersTypeormRepository,
  },
];
