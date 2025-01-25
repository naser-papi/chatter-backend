import { Global, Module } from "@nestjs/common";
import { PUB_SUB_TOKEN } from "@/common/constants";
import { PubSub } from "graphql-subscriptions";

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB_TOKEN,
      useValue: new PubSub(),
    },
  ],
  exports: [PUB_SUB_TOKEN],
})
export class PubSubModule {}
