import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { UserPreferencesView } from "@/modules/users/application/dto/user-preferences.view";
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from "@/modules/users/domain/repositories/users.repository";

/** Reads the signed-in user's account preferences (ADR-0018). */
@Injectable()
export class GetUserPreferencesUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Loads the actor's preferences, already merged onto the defaults.
   *
   * @param actor - The authenticated user.
   * @returns The user's preferences.
   * @throws {NotFoundException} When the user no longer exists.
   */
  async execute(actor: AuthenticatedUserEntity): Promise<UserPreferencesView> {
    const user = await this.usersRepository.findById(actor.id);
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    return user.preferences;
  }
}
