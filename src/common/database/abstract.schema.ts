import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@Schema()
@ObjectType({ isAbstract: true })
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => ID, { name: "id" })
  _id: Types.ObjectId;
}
