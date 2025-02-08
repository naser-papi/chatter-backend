import { forwardRef, Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesResolver } from "./messages.resolver";
import { ChatsModule } from "@/chats/chats.module";
import { MessagesController } from "./messages.controller";

@Module({
  imports: [forwardRef(() => ChatsModule)],
  providers: [MessagesResolver, MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
