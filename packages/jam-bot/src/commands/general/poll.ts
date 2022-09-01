import {
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import i18next from "i18next";

export const name = "poll";
export const description = "Creates a simple yes/no poll";
export const usage = "poll Are chips tasty?";
export const aliases = ["question"];
export const allowInDm = true;
export const rateLimit = 15;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question for your poll")
      .setRequired(true)
  );

function createPollEmbed(pollContent: string) {
  const embed = new EmbedBuilder();
  embed.setDescription(pollContent);
  embed.setTimestamp(Date.now());
  embed.setColor("#167C6A");
  return embed;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  if (!args[0]) return message.reply(i18next.t("poll.NO_ARGUMENTS.SPECIFIED"));
  await message.delete();
  const text = args.splice(0).join(" ");
  const embed = createPollEmbed(text);
  embed.setFooter({
    text: i18next.t("poll.POLL_FOOTER", { tag: message.author.tag }),
    iconURL: message.author.avatarURL(),
  });
  const sent = await message.channel.send({ embeds: [embed] });
  try {
    await sent.react("✅");
    sent.react("❌");
  } catch {
    return;
  }
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  const pollContent = interaction.options.getString("question");
  const embed = createPollEmbed(pollContent);
  const sent = await interaction.reply({ embeds: [embed], fetchReply: true });
  try {
    await sent.react("✅");
    sent.react("❌");
  } catch (err) {
    await interaction.followUp({
      content: i18next.t("poll.REACTION_ERROR"),
      ephemeral: true,
    });
  }
}
