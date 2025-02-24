import { AbstractDocument } from "@/common/database/abstract.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserDocument } from "@/users/entities/user.schema";
import { SchemaTypes, Types } from "mongoose";

@Schema({ collection: "messages", versionKey: false })
@ObjectType()
export class MessageDocument extends AbstractDocument {
  @Prop()
  @Field()
  content: string;

  @Prop()
  @Field()
  createAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: UserDocument.name })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => ID)
  chatId: Types.ObjectId;

  @Field(() => UserDocument, { nullable: true })
  user?: UserDocument;
}
