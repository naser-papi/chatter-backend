import { CreateChatInput } from "./create-chat.input";
import { PartialType } from "@nestjs/mapped-types";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field()
  id: number;
}
