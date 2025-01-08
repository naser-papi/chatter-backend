import { OnModuleInit, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { config, database, up } from "migrate-mongo";
@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly dbMigrationConfig: Partial<config.Config> = {
    mongodb: {
      databaseName: this.configSrv.getOrThrow("DB_NAME"),
      url: this.configSrv.getOrThrow("MONGO_URI"),
    },
    migrationsDir: `${__dirname}/../../migrations`,
    changelogCollectionName: "changelog",
    migrationFileExtension: ".js",
  };
  constructor(private readonly configSrv: ConfigService) {}
  async onModuleInit() {
    config.set(this.dbMigrationConfig);
    const { db, client } = await database.connect();
    await up(db, client);
  }
}
