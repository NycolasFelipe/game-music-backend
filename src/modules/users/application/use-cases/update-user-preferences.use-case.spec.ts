import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";
import { UpdateUserPreferencesUseCase } from "@/modules/users/application/use-cases/update-user-preferences.use-case";
import type { UserPreferences } from "@/modules/users/domain/constants/user-preferences.constant";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { USERS_REPOSITORY } from "@/modules/users/domain/repositories/users.repository";

const actor = new AuthenticatedUserEntity("user-1", "user");

const user = (preferences: UserPreferences) =>
  new UserEntity(
    "user-1",
    "player",
    "hash",
    preferences,
    new Date("2026-01-01T00:00:00Z"),
    new Date("2026-01-01T00:00:00Z"),
  );

describe("UpdateUserPreferencesUseCase", () => {
  let useCase: UpdateUserPreferencesUseCase;
  let usersRepository: { findById: jest.Mock; updatePreferences: jest.Mock };

  beforeEach(async () => {
    usersRepository = {
      findById: jest.fn().mockResolvedValue(user({ peopleView: "cards" })),
      updatePreferences: jest.fn((_id, preferences) =>
        Promise.resolve(user(preferences)),
      ),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserPreferencesUseCase,
        { provide: USERS_REPOSITORY, useValue: usersRepository },
      ],
    }).compile();
    useCase = moduleRef.get(UpdateUserPreferencesUseCase);
  });

  it("stores the chosen view", async () => {
    const result = await useCase.execute(actor, { peopleView: "graph" });

    expect(result.peopleView).toBe("graph");
    expect(usersRepository.updatePreferences).toHaveBeenCalledWith("user-1", {
      peopleView: "graph",
    });
  });

  it("keeps what the patch does not name", async () => {
    usersRepository.findById.mockResolvedValue(user({ peopleView: "graph" }));

    const result = await useCase.execute(actor, {});

    expect(result.peopleView).toBe("graph");
  });

  it("ignores a value outside the schema instead of storing junk", async () => {
    const result = await useCase.execute(actor, {
      peopleView: "tabela" as never,
    });

    expect(result.peopleView).toBe("cards");
  });

  it("fails when the user is gone", async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(actor, { peopleView: "graph" }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
