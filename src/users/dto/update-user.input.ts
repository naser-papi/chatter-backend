import { CreateUserInput } from "./create-user.input";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  //user can update jut his/her self record.
  // @Field()
  // id: string;
}
