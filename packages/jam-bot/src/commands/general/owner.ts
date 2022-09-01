import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import i18next from "i18next";

export const name = "owner";
export const description = "Displays the owner of the bot";
export const usage = "owner";
export const allowInDm = true;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  message.channel.send(process.env.ownerName ?? i18next.t("owner.NOT_FOUND"));
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply(
    process.env.ownerName ?? i18next.t("owner.NOT_FOUND")
  );
}
