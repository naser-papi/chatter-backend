import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

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

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field()
  id: number;
}

@ObjectType()
export class ChatItemOutput {
  @Field()
  id: string;

  @Field()
  isPrivate: boolean;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  userIds: string[];
}
