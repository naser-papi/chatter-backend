import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class OnMessageCreatedArgs {
  @Field()
  @IsNotEmpty()
  chatId: string;
}

@ArgsType()
export class GetMessagesArgs {
  @Field()
  @IsNotEmpty()
  chatId: string;
}

@InputType()
export class CreateMessageInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  chatId: string;
}
