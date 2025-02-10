import { AbstractDocument } from "@/common/database/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SchemaTypes, Types } from "mongoose";

@Schema({ versionKey: false, collection: "chats" })
@ObjectType()
export class ChatDocument extends AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop()
  @Field()
  isPrivate: boolean;

  @Prop()
  @Field()
  name: string;

  @Prop([{ type: SchemaTypes.ObjectId }])
  @Field(() => [ID], { nullable: true })
  userIds?: Types.ObjectId[];

  @Prop([MessageDocument])
  @Field(() => [MessageDocument], { nullable: true })
  messages: MessageDocument[];

  @Field(() => MessageDocument, { nullable: true })
  lastMessage?: MessageDocument;
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
