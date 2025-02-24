import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@/common/database/abstract.schema";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema({ versionKey: false, collection: "users" })
@ObjectType()
export class UserDocument extends AbstractDocument {
  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  fullName: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
