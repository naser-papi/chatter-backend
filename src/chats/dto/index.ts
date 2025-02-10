import { Field, ID, InputType } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { Types } from "mongoose";

@InputType()
export class CreateChatInput {
  @Field()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isPrivate: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  userIds?: Types.ObjectId[];
}

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field()
  @IsNotEmpty()
  id: number;
}
