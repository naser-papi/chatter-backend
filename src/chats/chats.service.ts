import { Injectable } from "@nestjs/common";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { ChatsRepository } from "./chats.repository";
import { ChatItemOutput } from "@/chats/dto/chat-item.output";

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      messages: [],
      userId,
    });
  }

  async findAll(): Promise<ChatItemOutput[]> {
    const items = await this.chatsRepository.find({});
    return items.map((chat) => ({
      name: chat.name,
      isPrivate: chat.isPrivate,
      id: chat._id.toString(),
      userIds: [],
    }));
  }

  async findOne(id: string): Promise<ChatItemOutput> {
    const byId = await this.chatsRepository.findOne({ _id: id });
    return {
      isPrivate: byId.isPrivate,
      name: byId.name,
      id: byId._id.toString(),
      userIds: [],
    };
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
