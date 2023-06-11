import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NecordModule } from "necord";
import { DiscordConfig } from "./discord.config";
import { DiscordService } from "./discord.service";
import { NecordConfigService } from "./necord-config.service";

@Module({
  imports: [
    ConfigModule.forFeature(DiscordConfig),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useClass: NecordConfigService,
    }),
  ],
  providers: [
    DiscordService,
  ],
  exports: [
    DiscordService,
  ],
})
export class DiscordModule {}