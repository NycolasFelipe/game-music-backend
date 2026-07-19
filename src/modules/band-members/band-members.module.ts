import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { AddBandMemberUseCase } from "@/modules/band-members/application/use-cases/add-band-member.use-case";
import { GenerateMemberCandidatesUseCase } from "@/modules/band-members/application/use-cases/generate-member-candidates.use-case";
import { GetBandMemberUseCase } from "@/modules/band-members/application/use-cases/get-band-member.use-case";
import { ListBandMembersUseCase } from "@/modules/band-members/application/use-cases/list-band-members.use-case";
import { RemoveBandMemberUseCase } from "@/modules/band-members/application/use-cases/remove-band-member.use-case";
import { UpdateBandMemberUseCase } from "@/modules/band-members/application/use-cases/update-band-member.use-case";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { bandMembersProviders } from "@/modules/band-members/infrastructure/persistence/providers/band-members.providers";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { BandMembersController } from "@/modules/band-members/presentation/http/controllers/band-members.controller";
import { MemberCandidatesController } from "@/modules/band-members/presentation/http/controllers/member-candidates.controller";

/**
 * Band-members module. Owns member persistence and generation, and imports
 * {@link BandsModule} so use cases can verify band ownership before operating
 * on members.
 */
@Module({
  imports: [TypeOrmModule.forFeature([BandMemberOrmEntity]), BandsModule],
  controllers: [BandMembersController, MemberCandidatesController],
  providers: [
    ...bandMembersProviders,
    GenerateMemberCandidatesUseCase,
    AddBandMemberUseCase,
    ListBandMembersUseCase,
    GetBandMemberUseCase,
    UpdateBandMemberUseCase,
    RemoveBandMemberUseCase,
  ],
  exports: [BAND_MEMBERS_REPOSITORY],
})
export class BandMembersModule {}
