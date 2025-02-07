import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatsRepository } from "./chats.repository";
import { CreateChatInput, UpdateChatInput } from "@/chats/dto";
import { PaginationArgsDto } from "@/common/dto";
import { ObjectId } from "mongodb";

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  userFilter(userId: string) {
    return {
      $or: [
        { userId: new Types.ObjectId(userId) },
        {
          userIds: {
            $in: [userId],
          },
        },
        { isPrivate: false },
      ],
    };
  }

  async chatsCount() {
    return this.chatsRepository.count();
  }

  async create(createChatInput: CreateChatInput, userId: string) {
    const chat = await this.chatsRepository.create({
      ...createChatInput,
      messages: [],
      userId,
    });
    chat.lastMessage = {
      _id: new ObjectId(),
      userId,
      content: "",
      createAt: new Date(),
      chatId: chat._id.toString(),
    };
    return chat;
  }

  async findAll(userId: string, pagination: PaginationArgsDto) {
    return this.chatsRepository.find(
      {
        ...this.userFilter(userId),
      },
      ["messages"],
      pagination,
    );
  }

  async findOne(id: string) {
    return this.chatsRepository.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
