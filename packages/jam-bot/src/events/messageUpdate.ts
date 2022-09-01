import { ChannelType, Message, EmbedBuilder } from "discord.js";
import { BotClient } from "../customDefinitions";
import { inputSnipe } from "../functions/snipe";
import { postToModlog } from "../functions/mod";
import { isBotOwner } from "../functions/util";
import i18next from "i18next";

export const name = "messageUpdate";

export async function register(
  client: BotClient,
  oldMessage: Message,
  newMessage: Message
): Promise<void> {
  try {
    if (oldMessage.partial) await oldMessage.fetch(true);
    if (newMessage.partial) await newMessage.fetch(true);
  } catch {
    return;
  }
  if (oldMessage.content == newMessage.content) return;
  if (
      newMessage.channel.type != ChannelType.GuildText &&
      newMessage.channel.type != ChannelType.GuildNews
  )
    return;
  if (newMessage.author.bot) return;
  if (oldMessage.pinned != newMessage.pinned) return;
  await inputSnipe(newMessage, oldMessage, "edit");
  if (isBotOwner(newMessage.author.id)) return;
  //#region Edit Log
  const embed = new EmbedBuilder();
  embed.setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() });
  embed.addFields({
    name: i18next.t("events:messageLogs.EMBED_TITLE", {
      type: "edited",
      channel: newMessage.channel.name,
    }),
    value: i18next.t("events:messageLogs.EDIT_ENTRY", {
      before: oldMessage.content ?? i18next.t("events:messageLogs.NO_CONTENT"),
      after: newMessage.content ?? i18next.t("events:messageLogs.NO_CONTENT"),
    })
  });
  embed.setFooter({
    text: i18next.t("events:messageLogs.EMBED_FOOTER", {
      userId: newMessage.author.id,
      channelId: newMessage.channel.id,
    }),
  });
  embed.setTimestamp(Date.now());
  embed.setColor("#61C9A8");
  await postToModlog(
    client,
    newMessage.guild.id,
    { embeds: [embed] },
    "messages"
  );
  //#endregion
}
