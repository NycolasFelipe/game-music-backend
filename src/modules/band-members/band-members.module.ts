import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BandsModule } from "@/modules/bands/bands.module";
import { AddBandMemberUseCase } from "@/modules/band-members/application/use-cases/add-band-member.use-case";
import { ArchiveMemberDeparturesUseCase } from "@/modules/band-members/application/use-cases/archive-member-departures.use-case";
import { GenerateMemberCandidatesUseCase } from "@/modules/band-members/application/use-cases/generate-member-candidates.use-case";
import { GetBandMemberUseCase } from "@/modules/band-members/application/use-cases/get-band-member.use-case";
import { GetMemberSalaryHistoryUseCase } from "@/modules/band-members/application/use-cases/get-member-salary-history.use-case";
import { ListBandMembersUseCase } from "@/modules/band-members/application/use-cases/list-band-members.use-case";
import { ListFormerMembersUseCase } from "@/modules/band-members/application/use-cases/list-former-members.use-case";
import { PaySalariesUseCase } from "@/modules/band-members/application/use-cases/pay-salaries.use-case";
import { RemoveBandMemberUseCase } from "@/modules/band-members/application/use-cases/remove-band-member.use-case";
import { SetMemberSalaryUseCase } from "@/modules/band-members/application/use-cases/set-member-salary.use-case";
import { UpdateBandMemberUseCase } from "@/modules/band-members/application/use-cases/update-band-member.use-case";
import { BAND_MEMBERS_REPOSITORY } from "@/modules/band-members/domain/repositories/band-members.repository";
import { bandMembersProviders } from "@/modules/band-members/infrastructure/persistence/providers/band-members.providers";
import { BandMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/band-member.orm-entity";
import { FormerMemberOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/former-member.orm-entity";
import { MemberSalaryOrmEntity } from "@/modules/band-members/infrastructure/persistence/typeorm/member-salary.orm-entity";
import { BandMembersController } from "@/modules/band-members/presentation/http/controllers/band-members.controller";
import { FormerMembersController } from "@/modules/band-members/presentation/http/controllers/former-members.controller";
import { MemberCandidatesController } from "@/modules/band-members/presentation/http/controllers/member-candidates.controller";

/**
 * Band-members module. Owns member persistence and generation, and imports
 * {@link BandsModule} so use cases can verify band ownership before operating
 * on members.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BandMemberOrmEntity,
      MemberSalaryOrmEntity,
      FormerMemberOrmEntity,
    ]),
    BandsModule,
  ],
  controllers: [
    BandMembersController,
    MemberCandidatesController,
    FormerMembersController,
  ],
  providers: [
    ...bandMembersProviders,
    GenerateMemberCandidatesUseCase,
    AddBandMemberUseCase,
    ListBandMembersUseCase,
    GetBandMemberUseCase,
    UpdateBandMemberUseCase,
    RemoveBandMemberUseCase,
    SetMemberSalaryUseCase,
    GetMemberSalaryHistoryUseCase,
    PaySalariesUseCase,
    ArchiveMemberDeparturesUseCase,
    ListFormerMembersUseCase,
  ],
  exports: [
    BAND_MEMBERS_REPOSITORY,
    PaySalariesUseCase,
    ArchiveMemberDeparturesUseCase,
  ],
})
export class BandMembersModule {}
