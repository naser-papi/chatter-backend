import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Inject, UseGuards } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { GqlAuthGuard } from "@/auth/guards/gql-auth.guard";
import {
  CreateMessageInput,
  GetMessagesArgs,
  OnMessageCreatedArgs,
} from "@/chats/messages/dto";
import { CurrentUser } from "@/auth/current-user.decorator";
import { ITokenPayload } from "@/auth/dto";
import { MessagesService } from "@/chats/messages/messages.service";
import { MessageDocument } from "@/chats/messages/entities/message.entity";
import { PUB_SUB_TOKEN } from "@/common/constants";

@Resolver(() => MessageDocument)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB_TOKEN) private readonly pubSub: PubSub,
  ) {}

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

  @Subscription(() => MessageDocument, {
    filter: (
      payload: { onMessageCreated: MessageDocument },
      variables: OnMessageCreatedArgs,
      context: any,
    ) => {
      const contextUser = context.req.user;
      return (
        payload.onMessageCreated.chatId === variables.chatId &&
        contextUser.id !== payload.onMessageCreated.userId
      );
    },
  })
  onMessageCreated(
    @Args() onMessageCreatedArgs: OnMessageCreatedArgs,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.messagesService.onMessageCreated(onMessageCreatedArgs, user.id);
  }
}
