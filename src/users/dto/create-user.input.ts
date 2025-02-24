import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  fullName: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
