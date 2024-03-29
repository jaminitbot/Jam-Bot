import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import { request } from "undici";
import i18next from "i18next";

export const name = "bird";
export const description = "Chirp chirp";
export const usage = "bird";
export const aliases = ["birb"];
export const allowInDm = true;
export const rateLimit = 3;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

async function returnBirdUrl() {
  const response = await request("https://some-random-api.ml/img/birb");
  if (response.statusCode != 200) return i18next.t("general:API_ERROR");
  return (await response.body.json()).link || i18next.t("general:API_ERROR");
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  message.channel.send(await returnBirdUrl());
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();
  await interaction.editReply(await returnBirdUrl());
}
