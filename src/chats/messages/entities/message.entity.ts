import { AbstractDocument } from "@/common/database/abstract.schema";
import { Prop, Schema } from "@nestjs/mongoose";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema({ collection: "messages", versionKey: false })
@ObjectType()
export class MessageDocument extends AbstractDocument {
  @Prop()
  @Field()
  content: string;

  @Prop()
  @Field()
  createAt: Date;

  @Prop()
  @Field()
  userId: string;

  @Prop()
  @Field()
  chatId: string;
}
