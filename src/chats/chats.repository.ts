import { AbstractRepository } from "@/common/database/abstract.repository";
import { ChatDocument } from "@/chats/entities/chat.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, PipelineStage } from "mongoose";
import { PaginationArgsDto } from "@/common/dto";

@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {
  protected readonly logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(ChatDocument.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }

  async find(
    filterQuery: FilterQuery<ChatDocument>,
    fieldsToExclude?: (keyof ChatDocument)[],
    pagination?: PaginationArgsDto,
  ): Promise<ChatDocument[]> {
    const excludeFields = fieldsToExclude?.reduce(
      (acc, field) => {
        acc[field as string] = 0; // Exclude fields with MongoDB's projection syntax
        return acc;
      },
      {} as Record<string, 0>,
    ) || { __v: 0 };

    // Add pagination stages if provided

    const pipeline: PipelineStage[] = [
      { $match: filterQuery },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
      {
        $sort: {
          "lastMessage.createAt": -1, // Sort by `lastMessage.createAt` in descending order
        },
      },
      {
        $project: excludeFields,
      },
    ];
    if (pagination) {
      const { skip = 0, limit = 10 } = pagination;
      if (skip > 0) pipeline.push({ $skip: skip });
      if (limit > 0) pipeline.push({ $limit: limit });
    }

    return this.model.aggregate(pipeline).exec();
  }

  async findOne(
    filterQuery: FilterQuery<ChatDocument>,
    fieldsToExclude?: (keyof ChatDocument)[],
  ): Promise<ChatDocument> {
    const byQuery = await this.find(filterQuery, fieldsToExclude);
    if (!byQuery || byQuery.length === 0) {
      this.logger.error(
        `Document not found with filter query ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }
    return byQuery[0];
  }
}
