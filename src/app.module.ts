import { Logger, Module, UnauthorizedException } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseModule } from "./common/database/database.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "./auth/auth.module";
import { ChatsModule } from "./chats/chats.module";
import { PubSubModule } from "@/common/pub-sub/pub-sub.module";
import { AuthService } from "@/auth/auth.service";
import { Request } from "express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        ALLOWED_ORIGINS: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        AZURE_STORAGE_CONNECTION_STRING: Joi.string().optional(),
      }),
    }),
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authSrv: AuthService) => ({
        autoSchemaFile: true,
        subscriptions: {
          "graphql-ws": {
            onConnect: async (context) => {
              try {
                const { extra } = context;
                (context as any).user = await authSrv.validateWSRequest(
                  (extra as { request: Request }).request,
                );
              } catch (err) {
                new Logger().error(err);
                throw new UnauthorizedException("UnKnow error: " + err);
              }
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
    UsersModule,
    LoggerModule.forRootAsync({
      useFactory: (configSrv: ConfigService) => {
        const isProd = configSrv.get("NODE_ENV") === "production";
        return {
          pinoHttp: {
            transport: isProd
              ? undefined
              : {
                  target: "pino-pretty",
                  options: { singleLine: true },
                },
            level: isProd ? "info" : "debug",
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ChatsModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
