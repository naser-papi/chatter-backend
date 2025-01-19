import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsResolver } from "./chats.resolver";
import { ChatsRepository } from "@/chats/chats.repository";
import { DatabaseModule } from "@/common/database/database.module";
import { ChatDocument, ChatSchema } from "@/chats/entities/chat.entity";

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: ChatDocument.name,
        schema: ChatSchema,
      },
    ]),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
})
export class ChatsModule {}
