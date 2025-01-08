import { Module } from "@nestjs/common";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { DbMigrationService } from "./db-migration.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configSrv: ConfigService) => ({
        uri: configSrv.get("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DbMigrationService],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
