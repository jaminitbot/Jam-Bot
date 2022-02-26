import { CommandInteraction, Message } from "discord.js";
import { BotClient } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import i18next from "i18next";
import { format } from "date-fns";

export const name = "uptime";
export const description = "Displays the bot's uptime";
export const usage = "uptime";
export const allowInDm = true;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  const timeDate = format(Date.now() - client.uptime, "HH:mm:ss - dd/MM/yyyy");
  message.channel.send(i18next.t("uptime.UPTIME_MESSAGE", { date: timeDate }));
}

export async function executeSlash(
  client: BotClient,
  interaction: CommandInteraction
) {
  const timeDate = format(
    Date.now() - client.uptime,
    "HH:mm:ss [-] DD/MM/YYYY"
  );
  await interaction.reply(
    i18next.t("uptime.UPTIME_MESSAGE", { date: timeDate })
  );
}
