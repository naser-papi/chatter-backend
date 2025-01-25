import { Inject, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatsRepository } from "@/chats/chats.repository";
import { CreateMessageInput, GetMessagesArgs } from "@/chats/messages/dto";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { PUB_SUB_TOKEN } from "@/common/constants";
import { PubSub } from "graphql-subscriptions";
import { ON_MESSAGE_CREATED_TRIGGER } from "@/chats/messages/constants";

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB_TOKEN) private readonly pubSub: PubSub,
  ) {}

  private userFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }

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
        ...this.userFilter(userId),
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
          _id: chatId,
          ...this.userFilter(userId),
        })
      )?.messages || []
    );
  }
}
