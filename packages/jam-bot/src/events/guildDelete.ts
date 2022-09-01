import { ChannelType, Guild } from "discord.js";

export const name = "guildDelete";

export async function register(guild: Guild) {
  if (!process.env.guildLogChannel) return;
  const channel = await guild.client.channels.fetch(
    process.env.guildLogChannel
  );
  if (!channel) return;
  if (channel.type != ChannelType.GuildNews && channel.type != ChannelType.GuildText) return;
  try {
    channel.send(`Oh dear, we left ${guild.name}, ${guild.id}`);
    // eslint-disable-next-line no-empty
  } catch {}
}
