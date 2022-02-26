import { CommandInteraction, Message } from "discord.js";
import { BotClient } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import { moddable, unban } from "../../functions/mod";
import i18next from "i18next";

export const name = "unban";
export const description = "Unbans a user from the server";
export const permissions = ["BAN_MEMBERS"];
export const usage = "unban @user";
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to unban").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for unbanning the user")
      .setRequired(false)
  );

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  message.channel.send(
    i18next.t("general:ONLY_SLASH_COMMAND", { command: "/mute" })
  );
}

export async function executeSlash(
  client: BotClient,
  interaction: CommandInteraction
) {
  if (!interaction.guild.me.permissions.has("BAN_MEMBERS"))
    return interaction.reply({
      content:
        "I don't have the correct permissions to unban people, ask an admin to check my permissions!",
    });
  const targetUser = interaction.options.getUser("user");
  const isModdable = await moddable(
    interaction.guild,
    targetUser.id,
    interaction.user.id
  );
  switch (isModdable) {
    case 1:
      break;
    case 2:
      return interaction.reply({
        content: i18next.t("mod.SAME_USER", { action: "unban" }),
        ephemeral: true,
      });
    case 3:
      break;
    case 4:
      break;
  }
  try {
    await interaction.guild.bans.fetch(targetUser.id);
  } catch (err) {
    if (String(err).includes("Unknown Ban")) {
      await interaction.reply({
        content: i18next.t("unban.TARGET_USER_NOT_BANNED", {
          tag: targetUser.tag,
        }),
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply(i18next.t("general:UNKNOWN_ERROR"));
      client.logger.warn("Unknown error when fetching bans: " + err);
      return;
    }
  }
  const reason = interaction.options.getString("reason");
  const formattedReason = `${interaction.user.tag}: ${
    reason ?? i18next.t("mod.NO_REASON_SPECIFIED")
  }`;
  const banResult = await unban(
    interaction.guild,
    targetUser.id,
    formattedReason
  );
  if (banResult == 0) {
    await interaction.reply({
      content: i18next.t("mod.ACTION_SUCCESSFUL", {
        tag: targetUser.tag,
        action: "unbanned",
        reason: reason ?? i18next.t("mod.NO_REASON_SPECIFIED"),
      }),
      allowedMentions: { parse: [] },
    });
  } else {
    await interaction.reply(i18next.t("general:UNKNOWN_ERROR"));
  }
}
