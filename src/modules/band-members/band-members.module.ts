import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { bandMembersProviders } from "@/modules/band-members/infrastructure/persistence/providers/band-members.providers";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";

/**
 * Band-members module. Owns member persistence and imports {@link BandsModule}
 * so use cases can verify band ownership before operating on members.
 */
@Module({
  imports: [TypeOrmModule.forFeature([BandMemberOrmEntity]), BandsModule],
  providers: [...bandMembersProviders],
  exports: [BAND_MEMBERS_REPOSITORY],
})
export class BandMembersModule {}
