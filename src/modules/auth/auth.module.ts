import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CryptoModule } from "@/common/crypto/crypto.module";
import { UsersModule } from "@/modules/users/users.module";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.use-case";
import { JwtStrategy } from "@/modules/auth/infrastructure/strategies/jwt.strategy";
import { AuthController } from "@/modules/auth/presentation/http/controllers/auth.controller";

/**
 * Authentication module. Provides the login flow and JWT-based request
 * authentication (strategy + guard).
 */
@Module({
  imports: [
    UsersModule,
    CryptoModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET", "change-me-in-production"),
        signOptions: {
          expiresIn: config.get<string>(
            "JWT_EXPIRES_IN",
            "1d",
          ) as import("ms").StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy],
})
export class AuthModule {}
