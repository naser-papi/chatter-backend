import { Field, ObjectType } from "@nestjs/graphql";

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
