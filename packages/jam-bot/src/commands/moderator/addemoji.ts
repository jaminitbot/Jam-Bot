import { Emoji, Message } from "discord.js";
import { BotClient, Permissions } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import i18next from "i18next";

export const name = "addemoji";
export const description = "Adds a custom emoji to the server";
export const usage = "addemoji EmojiName";
export const permissions: Permissions = ["MANAGE_EMOJIS_AND_STICKERS"];
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description);

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  if (!message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS"))
    return message.channel.send(
      i18next.t("general:BOT_INVALID_PERMISSION", {
        friendlyPermissionName: "manage emojis",
        permissionName: permissions[0],
      })
    );
  if (!args[0])
    return message.reply(i18next.t("addemoji.NO_ARGUMENTS_SPECIFIED"));
  const url = message.attachments.first();
  if (!url) return message.reply(i18next.t("addemoji.NO_ATTACHMENT"));
  message.guild.emojis
    .create(url.url, String(args[0]), {
      reason: i18next.t("addemoji.AUDIT_REASON", {
        tag: message.author.tag,
      }),
    })
    .then((emoji: Emoji) => {
      message.channel
        .send(
          i18next.t("addemoji.CREATION_SUCCESSFUL", {
            emojiName: emoji.name,
          })
        )
        .then((sent) => {
          sent.react(emoji.identifier);
          message.react(emoji.identifier);
        });
    })
    .catch(() => {
      message.reply(i18next.t("addemoji.UNKNOWN_ERROR"));
    });
}
