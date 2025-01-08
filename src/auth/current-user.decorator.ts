import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../users/entities/user.schema";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest().user;
  } else if (context.getType<GqlContextType>() === "graphql") {
    return GqlExecutionContext.create(context).getContext().req.user;
  }
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
