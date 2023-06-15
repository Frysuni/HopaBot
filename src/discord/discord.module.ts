import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NecordModule } from "necord";
import { MemberLeavingNotificationModule } from "./member-leaving-notification/member-leaving-notification.module";
import { BotUpdateAdvertisementModule } from "./bot-update-advertisement/bot-update-advertisement.module";
import { DiscordConfig } from "./discord.config";
import { DiscordService } from "./discord.service";
import { NecordConfigService } from "./necord-config.service";
import { ReactRolesModule } from "./react-roles/react-roles.module";

@Module({
  imports: [
    ConfigModule.forFeature(DiscordConfig),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useClass: NecordConfigService,
    }),
    ReactRolesModule,
    MemberLeavingNotificationModule,
    BotUpdateAdvertisementModule,
  ],
  providers: [
    DiscordService,
  ],
  exports: [
    DiscordService,
  ],
})
export class DiscordModule {}