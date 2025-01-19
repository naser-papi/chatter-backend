import { Field, InputType } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class CreateChatInput {
  @Field()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isPrivate: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  userIds?: string[];
}
