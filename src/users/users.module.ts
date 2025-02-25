import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { UsersRepository } from "./users.repository";
import { DatabaseModule } from "@/common/database/database.module";
import { UserDocument, UserSchema } from "./entities/user.schema";
import { StorageService } from "@/common/storage/storage.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository, StorageService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
