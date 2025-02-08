import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatsRepository } from "@/chats/chats.repository";
import { CreateMessageInput, GetMessagesArgs } from "@/chats/messages/dto";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { PUB_SUB_TOKEN } from "@/common/constants";
import { PubSub } from "graphql-subscriptions";
import { ON_MESSAGE_CREATED_TRIGGER } from "@/chats/messages/constants";
import { ChatsService } from "@/chats/chats.service";
import { ITokenPayload } from "@/auth/dto";

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatSrv: ChatsService,
    @Inject(PUB_SUB_TOKEN) private readonly pubSub: PubSub,
  ) {}

  async getMessagesCount(chatId: string): Promise<number> {
    const result = await this.chatsRepository.getMessageCount(chatId);
    if (!result.length) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }
    return result[0].messageCount;
  }

  async createMessage(
    { chatId, content }: CreateMessageInput,
    user: ITokenPayload,
  ) {
    const message: MessageDocument = {
      content,
      user: {
        _id: new Types.ObjectId(user.id),
        email: user.email,
        password: "",
      },
      userId: user.id,
      chatId,
      createAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(chatId),
        ...this.chatSrv.userFilter(user.id),
      },
      { $push: { messages: message } },
    );
    await this.pubSub.publish(ON_MESSAGE_CREATED_TRIGGER, {
      onMessageCreated: message,
    });
    return message;
  }

  async getMessages({ chatId, skip, limit }: GetMessagesArgs, userId: string) {
    const result = await this.chatsRepository.getMessages(
      {
        _id: new Types.ObjectId(chatId),
        ...this.chatSrv.userFilter(userId),
      },
      skip,
      limit,
    );
    if (!result) return [];
    else return result as MessageDocument[];
  }

  async onMessageCreated() {
    return this.pubSub.asyncIterableIterator(ON_MESSAGE_CREATED_TRIGGER);
  }
}
