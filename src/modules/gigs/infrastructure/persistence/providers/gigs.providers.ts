import { Provider } from "@nestjs/common";
import { GIGS_REPOSITORY } from "@/modules/gigs/domain/repositories/gigs.repository";
import { GigsTypeormRepository } from "@/modules/gigs/infrastructure/persistence/typeorm/gigs.typeorm.repository";

/** Binds the gigs repository token to its TypeORM implementation. */
export const gigsProviders: Provider[] = [
  GigsTypeormRepository,
  { provide: GIGS_REPOSITORY, useExisting: GigsTypeormRepository },
];
