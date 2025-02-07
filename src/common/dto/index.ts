import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class PaginationArgsDto {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  limit: number;
}
