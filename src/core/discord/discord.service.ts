import { Injectable, Logger } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { Client, Events, TextBasedChannel } from "discord.js";
import { Context, ContextOf, Once } from "necord";
import { getGuildChannel } from "~/common/clientManager";
import * as packageJson from '../../../package.json';
import { DiscordConfig } from "./discord.config";

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly config = this.configService.get('discord', { infer: true });

  public clientReady: Promise<Client<true>>;

  constructor(
    private readonly client: Client,
    private readonly configService: ConfigService<ConfigType<typeof DiscordConfig>, true>
  ) {
    this.clientReady = new Promise(res => this.client.on(Events.ClientReady, this.onReady.bind(this, res)));
  }

  public async logToDiscord(message: string) {
    await this.clientReady;
    const logChannel = getGuildChannel<TextBasedChannel>(this.client, this.config.logChannelId);
    return logChannel.send(message);
  }

  private async onReady(resolve: (value: Client<true>) => void) {
    const guilds = await this.client.guilds.fetch();
    if (guilds.size > 1) {
      this.logger.error('A bot cannot be in several guilds at the same time!');
      process.exit(1);
    }
    if (guilds.size === 0) {
      this.logger.error('The bot must be in the guild to run!');
      process.exit(1);
    }

    resolve(this.client);

    this.logger.log(`Bot started as ${this.client.user!.username}`);
    this.logToDiscord(`Бот запущен. v${packageJson.version}`);
  }

  @Once(Events.GuildCreate)
  private onGuildCreate(@Context() [guild]: ContextOf<Events.GuildCreate>) {
    guild.leave();

    const message = `The bot joined a new guild and immediately left it automatically. The bot does not allow working with more than one guild! Rejected guild: ${guild.name}`;
    this.logger.warn(message);
    this.logToDiscord(message);
  }

  @Once(Events.GuildDelete)
  private onGuildDelete(@Context() [guild]: ContextOf<Events.GuildDelete>) {
    this.logger.error('The bot has left the guild and will be shut down immediately!');
    process.exit(1);
  }
}