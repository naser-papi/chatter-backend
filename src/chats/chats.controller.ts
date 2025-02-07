import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { ChatsService } from "@/chats/chats.service";

@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get("count")
  @UseGuards(JwtAuthGuard)
  chatsCount() {
    return this.chatsService.chatsCount();
  }
}
