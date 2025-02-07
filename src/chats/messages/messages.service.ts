import { Inject, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatsRepository } from "@/chats/chats.repository";
import { CreateMessageInput, GetMessagesArgs } from "@/chats/messages/dto";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { PUB_SUB_TOKEN } from "@/common/constants";
import { PubSub } from "graphql-subscriptions";
import { ON_MESSAGE_CREATED_TRIGGER } from "@/chats/messages/constants";
import { ChatsService } from "@/chats/chats.service";

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatSrv: ChatsService,
    @Inject(PUB_SUB_TOKEN) private readonly pubSub: PubSub,
  ) {}

  async createMessage({ chatId, content }: CreateMessageInput, userId: string) {
    const message: MessageDocument = {
      content,
      userId,
      chatId,
      createAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.chatSrv.userFilter(userId),
      },
      { $push: { messages: message } },
    );
    await this.pubSub.publish(ON_MESSAGE_CREATED_TRIGGER, {
      onMessageCreated: message,
    });
    return message;
  }

  async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    return (
      (
        await this.chatsRepository.findOne({
          _id: new Types.ObjectId(chatId),
          ...this.chatSrv.userFilter(userId),
        })
      )?.messages || []
    );
  }

  async onMessageCreated() {
    return this.pubSub.asyncIterableIterator(ON_MESSAGE_CREATED_TRIGGER);
  }
}
