import { AbstractDocument } from "@/common/database/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema({ versionKey: false, collection: "chats" })
@ObjectType()
export class ChatDocument extends AbstractDocument {
  @Prop()
  @Field()
  userId: string;

  @Prop()
  @Field()
  isPrivate: boolean;

  @Prop()
  @Field()
  name: string;

  @Prop([String])
  @Field(() => [String], { nullable: true })
  userIds?: string[];

  @Prop([MessageDocument])
  @Field(() => [MessageDocument], { nullable: true })
  messages: MessageDocument[];

  @Field(() => MessageDocument, { nullable: true })
  lastMessage?: MessageDocument;
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
