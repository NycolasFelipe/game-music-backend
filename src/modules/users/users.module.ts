import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { USERS_REPOSITORY } from "@/modules/users/domain/repositories/users.repository";
import { usersProviders } from "@/modules/users/infrastructure/persistence/providers/users.providers";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/typeorm/user.orm-entity";

/**
 * Users module. Owns user persistence and exposes the users repository
 * (via {@link USERS_REPOSITORY}) to other modules such as auth.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [...usersProviders],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
