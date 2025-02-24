import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { PaginationArgsDto } from "@/common/dto";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, "_id">): Promise<TDocument> {
    const createdDoc = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDoc.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    fieldsToExclude?: (keyof TDocument)[],
    notThrowException = false,
  ): Promise<TDocument> {
    const excludeFields = fieldsToExclude?.reduce(
      (acc, field) => {
        acc[field as string] = 0; // Exclude fields with MongoDB's projection syntax
        return acc;
      },
      {} as Record<string, 0>,
    );

    const doc = await this.model
      .findOne(filterQuery)
      .select(excludeFields)
      .lean<TDocument>();
    if (!doc) {
      this.logger.error(
        `Document not found with filter query ${JSON.stringify(filterQuery)}`,
      );
      if (notThrowException) return null;
      throw new NotFoundException("User not found");
    }
    return doc;
  }
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const doc = this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>();

    if (!doc) {
      this.logger.error(
        `Document not found with filter query ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
    }
    return doc;
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    fieldsToExclude?: (keyof TDocument)[],
    pagination?: PaginationArgsDto,
  ): Promise<TDocument[]> {
    // Initialize the `select` to exclude fields
    const excludeFields = fieldsToExclude?.reduce(
      (acc, field) => {
        acc[field as string] = 0; // MongoDB syntax: 0 means exclude
        return acc;
      },
      {} as Record<string, 0>,
    );

    const query = this.model
      .find(filterQuery)
      .select(excludeFields)
      .lean<TDocument[]>();

    // Apply pagination if the pagination argument is provided
    if (pagination) {
      const { limit, skip } = pagination;
      if (typeof skip === "number") query.skip(skip);
      if (typeof limit === "number") query.limit(limit);
    }

    return query;
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>();
  }

  async count() {
    return this.model.countDocuments();
  }
}
