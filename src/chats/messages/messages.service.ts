import { Injectable } from "@nestjs/common";
import { ChatsRepository } from "@/chats/chats.repository";
import { CreateMessageInput } from "@/chats/messages/dto/create-message.input";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { Types } from "mongoose";
import { GetMessagesArgs } from "@/chats/messages/dto/get-messages-args";

@Injectable()
export class MessagesService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

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
