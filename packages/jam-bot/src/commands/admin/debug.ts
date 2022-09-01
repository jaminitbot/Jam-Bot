import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionType,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import i18next from "i18next";
import { format } from "date-fns";

export const name = "debug";
export const description = "Displays debug information";
export const permissions = ["MANAGE_GUILD"];
export const usage = "debug";
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);
function returnDebugEmbed(
  sentMessageTimestamp: number,
  newMessageTimestamp: number,
  clientUptime: number,
  websocketPing: number,
  guildId: string
) {
  const embed = new EmbedBuilder();
  embed.setTitle(i18next.t("debug.DEBUG_INFORMATION"));
  embed.addFields([
    {
      name: i18next.t("debug.ROUNDTRIP"),
      value: `${sentMessageTimestamp - newMessageTimestamp}ms`,
      inline: true,
    },
  ]);
  embed.addFields([
    {
      name: i18next.t("debug.API_LATENCY"),
      value: `${websocketPing}ms`,
      inline: true,
    },
  ]);
  const uptimeDate = format(Date.now() - clientUptime, "HH:mm:ss - dd/MM/yyyy");
  embed.addFields([
    {
      name: i18next.t("debug.UPTIME"),
      value: uptimeDate.toString(),
      inline: true,
    },
    { name: i18next.t("debug.GUILD_ID"), value: guildId, inline: true },
  ]);
  embed.setTimestamp(Date.now());
  embed.setColor("#222E50");
  return embed;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  const sentMessage = await message.channel.send("Loading...");
  const embed = returnDebugEmbed(
    sentMessage.createdTimestamp,
    message.createdTimestamp,
    client.uptime,
    client.ws.ping,
    message.guild.id
  );
  embed.setFooter({
    text: i18next.t("general:INITIATED_BY", { tag: message.author.tag }),
    iconURL: message.author.displayAvatarURL(),
  });
  sentMessage.edit({ content: null, embeds: [embed] });
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  const initiatedSlash = await interaction.deferReply({ fetchReply: true });
  const embed = returnDebugEmbed(
    initiatedSlash.createdTimestamp,
    interaction.createdTimestamp,
    client.uptime,
    client.ws.ping,
    interaction.guild.id
  );
  await interaction.editReply({ embeds: [embed] });
}
