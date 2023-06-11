import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { GatewayIntentBits, Partials } from 'discord.js';
import { NecordModuleOptions } from 'necord';
import { DiscordConfig } from './discord.config';
import { NecordConfigInterface } from './necord-config.interface';

@Injectable()
export class NecordConfigService implements NecordConfigInterface {
  private readonly config = this.configService.get('discord', { infer: true });

  constructor(
    private readonly configService: ConfigService<ConfigType<typeof DiscordConfig>, true>
  ) {}

  public createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions> {
    return {
      token: this.config.token,
      intents: this.getDiscordGatewayIntents(),
      partials: this.getDiscordPartials(),
      allowedMentions: {
        parse: [
          'everyone',
          'roles',
          'users',
        ],
        repliedUser: true,
      },
      presence: { status: 'idle' },
    };
  }

  private getDiscordGatewayIntents(): GatewayIntentBits[] {
    return [
      // GatewayIntentBits.AutoModerationConfiguration,
      // GatewayIntentBits.AutoModerationExecution,
      // GatewayIntentBits.DirectMessageReactions,
      // GatewayIntentBits.DirectMessageTyping,
      // GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildEmojisAndStickers,
      // GatewayIntentBits.GuildIntegrations,
      // GatewayIntentBits.GuildInvites,
      // GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      // GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildMessages,
      // GatewayIntentBits.GuildModeration,
      // GatewayIntentBits.GuildPresences,
      // GatewayIntentBits.GuildScheduledEvents,
      // GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
    ];
  }

  private getDiscordPartials(): Partials[] {
    return [
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.Message,
      Partials.Reaction,
      Partials.ThreadMember,
      Partials.User,
    ];
  }
}