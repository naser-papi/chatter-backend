import { Controller, Get, Param } from "@nestjs/common";
import { MessagesService } from "@/chats/messages/messages.service";

@Controller("messages")
export class MessagesController {
  constructor(private readonly msgSrv: MessagesService) {}

  @Get("count/:chatId")
  getCount(@Param("chatId") chatId: string) {
    return this.msgSrv.getMessagesCount(chatId);
  }
}
