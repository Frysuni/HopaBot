import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Events, Client } from "discord.js";
import { getGuild } from "@common/clientManager";
import { BotUpdateAdvertisementEmbed } from "./bot-update-advertisement.embed";

@Injectable()
export class BotUpdateAdvertisementService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BotUpdateAdvertisementService.name);

  constructor(
    private readonly client: Client,
    private readonly botUpdateAdvertisementEmbed: BotUpdateAdvertisementEmbed,
  ) {}

  async onApplicationBootstrap() {
    if (require('../../../package.json').version !== this.botUpdateAdvertisementEmbed.forVersion) return;
    if (!this.botUpdateAdvertisementEmbed.ready || this.botUpdateAdvertisementEmbed.wasUsed) return;

    await new Promise(res => this.client.on(Events.ClientReady, res));

    const systemChannel = getGuild(this.client).systemChannel;
    if (!systemChannel) return this.logger.warn('No system channel found in guild.');
    console.log(1);
    await systemChannel.send({ embeds: [this.botUpdateAdvertisementEmbed.buildEmbed() ] });

    this.botUpdateAdvertisementEmbed.setUsed();
  }

}