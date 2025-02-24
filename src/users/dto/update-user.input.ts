import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsStrongPassword } from "class-validator";

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNotEmpty()
  fullName: string;

  @Field({ nullable: true })
  @IsStrongPassword()
  password?: string;
}
