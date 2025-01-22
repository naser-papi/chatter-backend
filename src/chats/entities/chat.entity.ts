import { AbstractDocument } from "@/common/database/abstract.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType } from "@nestjs/graphql";
import { MessageDocument } from "@/chats/messages/entities/message.entity";

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
  @Field({ nullable: true })
  name?: string;

  @Prop([String])
  @Field(() => [String], { nullable: true })
  userIds?: string[];

  @Prop([MessageDocument])
  messages: MessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
