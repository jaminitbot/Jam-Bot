import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import i18next from "i18next";

export const name = "support";
export const description = "Displays support information";
export const usage = "support";
export const allowInDm = false;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

async function returnSupportEmbed() {
  const embed = new EmbedBuilder();
  embed.setTitle(i18next.t("support.SUPPORT_TITLE"));
  embed.setDescription(i18next.t("support.SUPPORT_DESCRIPTION"));
  const row = new ActionRowBuilder();
  row.addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(i18next.t("support.COMMAND_DOCS"))
      .setURL("https://jaminitbot.github.io/Jam-Bot/"),
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(i18next.t("support.SUPPORT_SERVER"))
      .setURL("https://discord.gg/DTcwugcgZ2")
  );
  return [embed, row];
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  const embedObject = await returnSupportEmbed();
  message.channel.send({
    // @ts-expect-error
    embeds: [embedObject[0]],
    // @ts-expect-error
    components: [embedObject[1]],
  });
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  const embedObject = await returnSupportEmbed();
  // @ts-expect-error
  await interaction.reply({
    embeds: [embedObject[0]],
    components: [embedObject[1]],
  });
}
