import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UserDocument } from "./entities/user.schema";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { ITokenPayload } from "../auth/types";

@Resolver(() => UserDocument)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserDocument)
  createUser(@Args("data") data: CreateUserInput) {
    return this.usersService.create(data);
  }

  @Query(() => [UserDocument], { name: "users" })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UserDocument, { name: "user" })
  @UseGuards(GqlAuthGuard)
  findOne(@Args("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => UserDocument)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @Args("data") data: UpdateUserInput,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.usersService.update(user.id, data);
  }

  @Mutation(() => UserDocument)
  @UseGuards(GqlAuthGuard)
  removeUser(@CurrentUser() user: ITokenPayload) {
    return this.usersService.remove(user.id);
  }

  @Query(() => UserDocument)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: ITokenPayload) {
    return user;
  }
}
