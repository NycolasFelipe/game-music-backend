import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { DatabaseModule } from "@/database/database.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { BandMembersModule } from "@/modules/band-members/band-members.module";
import { BandsModule } from "@/modules/bands/bands.module";
import { UsersModule } from "@/modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BandsModule,
    BandMembersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
