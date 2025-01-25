import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt-strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configSrv: ConfigService) => ({
        secret: configSrv.getOrThrow("JWT_SECRET"),
        signOptions: {
          expiresIn: +configSrv.getOrThrow("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
