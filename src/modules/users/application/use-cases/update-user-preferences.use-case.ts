import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { UserPreferencesView } from "@/modules/users/application/dto/user-preferences.view";
import {
  mergeUserPreferences,
  type UserPreferences,
} from "@/modules/users/domain/constants/user-preferences.constant";
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from "@/modules/users/domain/repositories/users.repository";

/**
 * Updates the signed-in user's account preferences (ADR-0018). Partial by
 * design: what the patch does not name is kept as it was.
 */
@Injectable()
export class UpdateUserPreferencesUseCase {
  private readonly logger = new Logger(UpdateUserPreferencesUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Merges a partial update onto the actor's stored preferences.
   *
   * @param actor - The authenticated user.
   * @param patch - The settings to change.
   * @returns The preferences as they now stand.
   * @throws {NotFoundException} When the user no longer exists.
   */
  async execute(
    actor: AuthenticatedUserEntity,
    patch: Partial<UserPreferences>,
  ): Promise<UserPreferencesView> {
    const user = await this.usersRepository.findById(actor.id);
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const merged = mergeUserPreferences(user.preferences, patch);
    const updated = await this.usersRepository.updatePreferences(
      actor.id,
      merged,
    );
    if (!updated) {
      throw new NotFoundException("User not found.");
    }

    this.logger.log(
      `User ${actor.id} preferences updated (peopleView=${merged.peopleView})`,
    );
    return updated.preferences;
  }
}
