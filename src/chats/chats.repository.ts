import { AbstractRepository } from "@/common/database/abstract.repository";
import { ChatDocument } from "@/chats/entities/chat.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {
  protected readonly logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(ChatDocument.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
