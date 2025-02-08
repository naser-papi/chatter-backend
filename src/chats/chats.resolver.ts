import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { GqlAuthGuard } from "@/auth/guards/gql-auth.guard";
import { CurrentUser } from "@/auth/current-user.decorator";
import { ITokenPayload } from "@/auth/dto";
import { ChatDocument } from "./entities/chat.entity";
import { CreateChatInput, UpdateChatInput } from "@/chats/dto";
import { PaginationArgsDto } from "@/common/dto";

@Resolver("Chat")
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ChatDocument, { name: "createChat" })
  create(
    @Args("data") data: CreateChatInput,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.chatsService.create(data, user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ChatDocument], { name: "chats" })
  findAll(
    @CurrentUser() user: ITokenPayload,
    @Args() pagination: PaginationArgsDto,
  ) {
    return this.chatsService.findAll(user.id, pagination);
  }

  @Query(() => ChatDocument, { name: "chat" })
  findOne(@Args("id") id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => ChatDocument, { name: "updateChat" })
  update(@Args("updateChatInput") updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => ChatDocument, { name: "removeChat" })
  remove(@Args("id") id: number) {
    return this.chatsService.remove(id);
  }
}
