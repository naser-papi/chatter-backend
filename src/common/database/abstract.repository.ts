import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

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

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const doc = this.model.findOne(filterQuery).lean<TDocument>();
    if (!doc) {
      this.logger.error(
        `Document not found with filter query ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException("Document not found");
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

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>();
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>();
  }
}
