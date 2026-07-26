import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GetUserPreferencesUseCase } from "@/modules/users/application/use-cases/get-user-preferences.use-case";
import { UpdateUserPreferencesUseCase } from "@/modules/users/application/use-cases/update-user-preferences.use-case";
import { USERS_REPOSITORY } from "@/modules/users/domain/repositories/users.repository";
import { usersProviders } from "@/modules/users/infrastructure/persistence/providers/users.providers";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/typeorm/user.orm-entity";
import { UserPreferencesController } from "@/modules/users/presentation/http/controllers/user-preferences.controller";

/**
 * Users module. Owns user persistence and account-level preferences
 * (ADR-0018), and exposes the users repository (via {@link USERS_REPOSITORY})
 * to other modules such as auth.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserPreferencesController],
  providers: [
    ...usersProviders,
    GetUserPreferencesUseCase,
    UpdateUserPreferencesUseCase,
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
