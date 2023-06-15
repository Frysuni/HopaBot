import { Module } from "@nestjs/common";
import { BotUpdateAdvertisementEmbed } from "./bot-update-advertisement.embed";
import { BotUpdateAdvertisementService } from "./bot-update-advertisement.service";

@Module({
  providers: [
    BotUpdateAdvertisementService,
    BotUpdateAdvertisementEmbed,
  ],
})
export class BotUpdateAdvertisementModule {}