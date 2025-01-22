import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MessagesService } from "./messages.service";
import { MessageDocument } from "./entities/message.entity";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "@/auth/guards/gql-auth.guard";
import { CreateMessageInput } from "@/chats/messages/dto/create-message.input";
import { CurrentUser } from "@/auth/current-user.decorator";
import { ITokenPayload } from "@/auth/types";
import { GetMessagesArgs } from "./dto/get-messages-args";

@Resolver(() => MessageDocument)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => MessageDocument)
  @UseGuards(GqlAuthGuard)
  createMessage(
    @Args("data") data: CreateMessageInput,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.messagesService.createMessage(data, user.id);
  }

  @Query(() => [MessageDocument], { name: "messages" })
  @UseGuards(GqlAuthGuard)
  getMessages(
    @Args() data: GetMessagesArgs,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.messagesService.getMessages(data, user.id);
  }
}
