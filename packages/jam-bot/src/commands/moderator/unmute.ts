import {
  ChatInputCommandInteraction,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient, Permissions } from "../../customDefinitions";
import { moddable, unmute } from "../../functions/mod";
import i18next from "i18next";

export const name = "unmute";
export const description = "Unmutes a user";
export const permissions: Permissions = ["MODERATE_MEMBERS"];
export const usage = "unmute @user";
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to unmute")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for unmuting the user")
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
  interaction: ChatInputCommandInteraction
) {
  if (
    !interaction.guild.members.me.permissions.has(
      PermissionFlagsBits.ModerateMembers
    )
  )
    return interaction.reply({
      content: i18next.t("general:BOT_INVALID_PERMISSION", {
        friendlyPermissionName: "timeout members",
        permissionName: "MODERATE_MEMBERS",
      }),
      ephemeral: true,
    });
  const targetUser = interaction.options.getUser("user");
  const isModdable = await moddable(
    interaction.guild,
    targetUser.id,
    interaction.user.id
  );
  switch (isModdable) {
    case 1:
      return interaction.reply({
        content: i18next.t("mod.INVALID_USER"),
        ephemeral: true,
      });
    case 2:
      return interaction.reply({
        content: i18next.t("mod.SAME_USER", { action: "unmute" }),
        ephemeral: true,
      });
    case 3:
      return interaction.reply({
        content: i18next.t("mod.BOT_ROLE_TOO_LOW"),
        ephemeral: true,
      });
    case 4:
      return interaction.reply({
        content: i18next.t("USER_ROLE_TOO_LOW"),
        ephemeral: true,
      });
  }
  const reason = interaction.options.getString("reason");
  const formattedReason = `${interaction.user.tag}: ${
    reason ?? i18next.t("mod.NO_REASON_SPECIFIED")
  }`;
  const unmuteResult = await unmute(
    interaction.guild,
    targetUser.id,
    formattedReason
  );
  if (unmuteResult == 0) {
    await interaction.reply({
      content: i18next.t("mod.ACTION_SUCCESSFUL", {
        tag: targetUser.tag,
        action: "unmuted",
        reason: reason ?? i18next.t("mod.NO_REASON_SPECIFIED"),
      }),
      allowedMentions: { parse: [] },
    });
  } else if (unmuteResult == 2) {
    await interaction.reply({
      content: i18next.t("mute.USER_NOT_MUTED", { tag: targetUser.tag }),
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: i18next.t("general:UNKNOWN_ERROR"),
      ephemeral: true,
    });
  }
}
