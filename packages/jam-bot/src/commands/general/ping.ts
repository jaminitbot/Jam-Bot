import {
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import i18next from "i18next";

export const name = "ping";
export const description = "Displays latency information";
export const usage = "ping";
export const aliases = ["latency", "pong"];
export const allowInDm = true;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

function createLatencyEmbed(
  incomingMessageTimestamp: number,
  sentMessageTimestamp: number,
  client: BotClient
) {
  const embed = new EmbedBuilder();
  embed.setDescription(
    `:stopwatch: ${
      sentMessageTimestamp - incomingMessageTimestamp
    }ms :hourglass: ${Math.round(client.ws.ping)}ms`
  );
  embed.setFooter({ text: i18next.t("ping.PING_FOOTER") });
  embed.setColor("#FB21CB");
  return embed;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  const sent = await message.channel.send("Pinging...");
  await sent.edit({
    content: null,
    embeds: [
      createLatencyEmbed(
        message.createdTimestamp,
        sent.createdTimestamp,
        client
      ),
    ],
  });
  await message.react("🏓");
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  const reply = await interaction.deferReply({ fetchReply: true });
  const embed = createLatencyEmbed(
    interaction.createdTimestamp,
    reply.createdTimestamp,
    client
  );
  await interaction.editReply({ embeds: [embed] });
}
