import { from } from 'env-var';

export const DiscordConfig = () => {
  const env = from(process.env);

  return {
    discord: {
      token: env.get('DISCORD_BOT_TOKEN').required().asString(),
      logChannelId: env.get('DISCORD_LOG-CHANNEL-ID').required().asString(),
    },
  };
};
