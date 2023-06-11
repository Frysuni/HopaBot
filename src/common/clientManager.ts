import type { Client, Guild, GuildBasedChannel, AnyThreadChannel, TextBasedChannel, VoiceBasedChannel } from "discord.js";

type GuildChannel = TextBasedChannel | AnyThreadChannel | VoiceBasedChannel | GuildBasedChannel;

export const getGuild = (client: Client<true>): Guild => client.guilds.cache.first()!;
export const getGuildChannel =
  <ChannelType extends GuildChannel = GuildBasedChannel>
    (client: Client<true>, channelId: string) =>
      getGuild(client).channels.cache.get(channelId) as ChannelType;