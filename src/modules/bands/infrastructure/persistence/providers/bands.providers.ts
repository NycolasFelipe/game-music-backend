import { Provider } from "@nestjs/common";
import { BANDS_REPOSITORY } from "@/modules/bands/domain/repositories/bands.repository";
import { MEMBER_RELATIONSHIPS_REPOSITORY } from "@/modules/bands/domain/repositories/member-relationships.repository";
import { BandsTypeormRepository } from "@/modules/bands/infrastructure/persistence/typeorm/bands.typeorm.repository";
import { MemberRelationshipsTypeormRepository } from "@/modules/bands/infrastructure/persistence/typeorm/member-relationships.typeorm.repository";

/**
 * DI providers binding the bands and member-relationships repository tokens to
 * their TypeORM implementations.
 */
export const bandsProviders: Provider[] = [
  BandsTypeormRepository,
  {
    provide: BANDS_REPOSITORY,
    useExisting: BandsTypeormRepository,
  },
  MemberRelationshipsTypeormRepository,
  {
    provide: MEMBER_RELATIONSHIPS_REPOSITORY,
    useExisting: MemberRelationshipsTypeormRepository,
  },
];
