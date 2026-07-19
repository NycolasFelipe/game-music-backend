import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PASSWORD_HASHER } from "@/common/crypto/password-hasher";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { USERS_REPOSITORY } from "@/modules/users/domain/repositories/users.repository";
import { LoginUseCase } from "./login.use-case";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let usersRepository: {
    findByUsername: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
  };
  let passwordHasher: { hash: jest.Mock; compare: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  const existingUser = new UserEntity(
    "user-id-1",
    "user",
    "hashed-password",
    new Date("2026-01-01T00:00:00Z"),
    new Date("2026-01-01T00:00:00Z"),
  );

  beforeEach(async () => {
    usersRepository = {
      findByUsername: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };
    passwordHasher = { hash: jest.fn(), compare: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: USERS_REPOSITORY, useValue: usersRepository },
        { provide: PASSWORD_HASHER, useValue: passwordHasher },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    useCase = moduleRef.get(LoginUseCase);
  });

  it("returns an access token and public user for valid credentials", async () => {
    usersRepository.findByUsername.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue("signed-jwt-token");

    const result = await useCase.execute({
      username: "user",
      password: "user",
    });

    expect(result).toEqual({
      accessToken: "signed-jwt-token",
      user: { id: "user-id-1", username: "user" },
    });
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      "user",
      "hashed-password",
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: "user-id-1",
      username: "user",
    });
  });

  it("throws UnauthorizedException when the user does not exist", async () => {
    usersRepository.findByUsername.mockResolvedValue(null);

    await expect(
      useCase.execute({ username: "ghost", password: "user" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when the password is invalid", async () => {
    usersRepository.findByUsername.mockResolvedValue(existingUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ username: "user", password: "wrong" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
