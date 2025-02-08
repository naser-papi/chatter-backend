import { AbstractRepository } from "@/common/database/abstract.repository";
import { ChatDocument } from "@/chats/entities/chat.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, PipelineStage, Types } from "mongoose";
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
          lastMessage: {
            $ifNull: [
              { $arrayElemAt: ["$messages", -1] },
              { content: "", createAt: new Date() },
            ],
          },
        },
      },
      // Lookup to fetch user details for the lastMessage using userId
      {
        $lookup: {
          from: "users", // The name of the 'users' collection
          localField: "lastMessage.userId", // Path to the field in `lastMessage` containing userId
          foreignField: "_id", // The field in 'users' matching the userId
          as: "lastMessage.user", // Embed the corresponding user information
        },
      },
      {
        $unwind: {
          path: "$lastMessage.user", // Unwind the user array to make it a single object
          preserveNullAndEmptyArrays: true, // Optional: handles cases where no user is found
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

  async getMessageCount(chatId: string) {
    return this.model.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(chatId),
        },
      },
      { $project: { messageCount: { $size: "$messages" } } }, // Calculate the size of the messages array
    ]);
  }

  async getMessages(
    filterQuery: FilterQuery<ChatDocument>,
    skip: number,
    limit: number,
  ) {
    return this.model.aggregate([
      {
        $match: filterQuery,
      },
      {
        $unwind: "$messages",
      },
      { $replaceRoot: { newRoot: "$messages" } },
      { $sort: { createAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $unset: "userId" },
    ]);
  }
}
