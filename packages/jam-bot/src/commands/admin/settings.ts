import {
  AutocompleteInteraction,
  Channel,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { BotClient, Permissions } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import prisma, { getGuildSetting, setGuildSetting } from "../../functions/db";
import { booleanToHuman, randomEmoji } from "../../functions/util";
import { randomHexCode } from "@jaminitbot/bot-utils";
import i18next from "i18next";
import { ChannelType } from "discord-api-types/v9";
import { removeItemFromArray } from "../../functions/util";
import { chunk as chunkArray } from "lodash";
import { ObjectID } from "bson";

export const name = "settings";
export const description = "Configures the bot's settings";
export const permissions: Permissions = ["MANAGE_GUILD"];
export const usage = "settings";
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addSubcommandGroup((group) =>
    group
      .setName("general")
      .setDescription("General settings")
      .addSubcommand((command) =>
        command
          .setName("prefix")
          .setDescription("Sets the bot's prefix")
          .addStringOption((option) =>
            option
              .setName("prefix")
              .setDescription("The new prefix")
              .setRequired(false)
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("suggestions")
      .setDescription("Suggestion related settings")
      .addSubcommand((command) =>
        command
          .setName("channel")
          .setDescription("Sets the suggestion channel")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("The channel to send suggestions to")
              .setRequired(false)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("useable")
          .setDescription("Whether to allow suggestions to be made")
          .addBooleanOption((option) =>
            option
              .setName("on")
              .setDescription("Send suggestions?")
              .setRequired(false)
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("modlog")
      .setDescription("Modlog related settings")
      .addSubcommand((command) =>
        command
          .setName("channels")
          .setDescription("Sets the various channels to send modlogs")
          .addChannelOption((option) =>
            option
              .setName("default")
              .setDescription(
                "The default channel for modlogs (used if other channels aren't specified and the event is turned on"
              )
              .setRequired(false)
          )
          .addChannelOption((option) =>
            option
              .setName("messages")
              .setDescription("Channel to message related modlogs")
              .setRequired(false)
          )
          .addChannelOption((option) =>
            option
              .setName("members")
              .setDescription("Channel to send member related modlogs")
              .setRequired(false)
          )
          .addChannelOption((option) =>
            option
              .setName("server")
              .setDescription("Channel to send server related modlogs")
              .setRequired(false)
          )
          .addChannelOption((option) =>
            option
              .setName("joinleaves")
              .setDescription("Channel to send join/leave modlogs")
              .setRequired(false)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("log")
          .setDescription("Turns on/off logging of certain events")
          .addBooleanOption((option) =>
            option
              .setName("messages")
              .setDescription("Log message events?")
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("members")
              .setDescription("Log member events?")
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("server")
              .setDescription("Log server events?")
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("joinleaves")
              .setDescription("Log join/leave events?")
              .setRequired(false)
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("roles")
      .setDescription("Manages settings relating to self assignable roles")
      .addSubcommand((command) =>
        command
          .setName("add")
          .setDescription("Adds a role to a reaction role message")
          .addStringOption((option) =>
            option
              .setName("messagename")
              .setDescription("The reaction role message")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("Role to add")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("remove")
          .setDescription("Removes a role from a reaction role message")
          .addStringOption((option) =>
            option
              .setName("messagename")
              .setDescription("The reaction role message")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("Role to remove")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("createmessage")
          .setDescription("Creates the reaction role message")
          .addStringOption((option) =>
            option
              .setName("name")
              .setDescription("A name for the reaction role message")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("deletemessage")
          .setDescription("Deletes a given reaction role message")
          .addStringOption((option) =>
            option
              .setName("messagename")
              .setDescription("The name of the reaction role message")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("sendmessage")
          .setDescription("Sends the given reaction role message")
          .addStringOption((option) =>
            option
              .setName("messagename")
              .setDescription("The reaction role message")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("Channel to send the message in")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("messagecontent")
              .setDescription("The content of the message")
              .setRequired(false)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("regeneratemessage")
          .setDescription("Recreates a reaction message")
          .addStringOption((option) =>
            option
              .setName("messagename")
              .setDescription("The reaction role message")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option
              .setName("messagecontent")
              .setDescription("The content of the message")
              .setRequired(false)
          )
      )
  );

async function validTextChannel(client: BotClient, channelId: string) {
  const channel = await client.channels.fetch(channelId);
  if (!channel.isText || channel.type == "DM") {
    return null;
  }
  return channel;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  message.channel.send(
    i18next.t("general:ONLY_SLASH_COMMAND", { command: name })
  );
}

export async function executeSlash(
  client: BotClient,
  interaction: CommandInteraction
) {
  const subCommandGroup = interaction.options.getSubcommandGroup();
  const subCommand = interaction.options.getSubcommand();
  if (subCommandGroup == "general") {
    if (subCommand == "prefix") {
      const newPrefix = interaction.options.getString("prefix");
      if (!newPrefix) {
        const currentPrefix =
          (await getGuildSetting(interaction.guild.id, "prefix")) ??
          process.env.defaultPrefix;
        await interaction.reply({
          content: i18next.t("settings.CURRENT_PREFIX", {
            prefix: currentPrefix,
          }),
        });
        return;
      }
      if (newPrefix.length > 10) {
        await interaction.reply({
          content: i18next.t("settings.PREFIX_TOO_LONG", {
            length: 10,
          }),
          ephemeral: true,
        });
      } else {
        await setGuildSetting(interaction.guild.id, "prefix", newPrefix);
        await interaction.reply({
          content: i18next.t("settings.SET_PREFIX_SUCCESS", {
            prefix: newPrefix,
          }),
        });
      }
      return;
    }
  } else if (subCommandGroup == "suggestions") {
    if (subCommand == "channel") {
      const newSuggestionsChannel = interaction.options.getChannel("channel");
      if (!newSuggestionsChannel) {
        const currentSuggestionChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "suggestions",
            setting: "channel",
          }
        );
        const currentSuggestionsChannel = currentSuggestionChannelId
          ? `<#${currentSuggestionChannelId}>`
          : "not set";
        await interaction.reply(
          i18next.t("settings.CURRENT_SUGGESTIONS_CHANNEL", {
            channel: currentSuggestionsChannel,
          })
        );
        return;
      }
      const newChannel = await client.channels.fetch(newSuggestionsChannel.id);
      if (!newChannel.isText || newChannel.type == "DM") {
        await interaction.reply({
          content: i18next.t("general:INVALID_CHANNEL_TYPE", {
            correctType: "text",
          }),
          ephemeral: true,
        });
      } else {
        await setGuildSetting(interaction.guild.id, {
          group: "suggestions",
          setting: "channel",
          value: newChannel.id,
        });
        await setGuildSetting(interaction.guild.id, {
          group: "suggestions",
          setting: "enabled",
          value: true,
        });
        const newSuggestionsChannel = `<#${newChannel.id}>`;
        await interaction.reply(
          i18next.t("settings.SET_SUGGESTIONS_CHANNEL_SUCCESS", {
            channel: newSuggestionsChannel,
          })
        );
      }
      return;
    } else if (subCommand == "useable") {
      const sendSuggestions = interaction.options.getBoolean("on");
      if (typeof sendSuggestions != "boolean") {
        await interaction.reply(
          i18next.t("settings.SUGGESTIONS_ENABLED_DISABLED_CURRENT", {
            toggle: booleanToHuman(
              await getGuildSetting(interaction.guild.id, {
                group: "suggestions",
                setting: "enabled",
              })
            ),
          })
        );
        return;
      }
      await setGuildSetting(interaction.guild.id, {
        group: "suggestions",
        setting: "enabled",
        value: sendSuggestions,
      });
      await interaction.reply(
        i18next.t("settings.SET_SUGGESTIONS_ENABLED_DISABLED_SUCCESS", {
          toggle: booleanToHuman(sendSuggestions),
        })
      );
      return;
    }
  } else if (subCommandGroup == "modlog") {
    if (subCommand == "channels") {
      const mainChannelRaw = interaction.options.getChannel("default");
      const messagesChannelRaw = interaction.options.getChannel("messages");
      const membersChannelRaw = interaction.options.getChannel("members");
      const serverChannelRaw = interaction.options.getChannel("server");
      const joinLeavesChannelRaw = interaction.options.getChannel("joinleaves");
      if (
        !mainChannelRaw &&
        !messagesChannelRaw &&
        !membersChannelRaw &&
        !serverChannelRaw &&
        !joinLeavesChannelRaw
      ) {
        const currentMainChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "modlog",
            setting: "mainChannelId",
          }
        );
        const currentMainChannelMentioned = currentMainChannelId
          ? `<#${currentMainChannelId}>`
          : "Not Set";
        const currentMessagesChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "modlog",
            setting: "messagesChannelId",
          }
        );
        const currentMessagesChannelMentioned = currentMessagesChannelId
          ? `<#${currentMessagesChannelId}>`
          : "Not Set";
        const currentMembersChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "modlog",
            setting: "membersChannelId",
          }
        );
        const currentMembersChannelMentioned = currentMembersChannelId
          ? `<#${currentMembersChannelId}>`
          : "Not Set";
        const currentServerChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "modlog",
            setting: "serverChannelId",
          }
        );
        const currentServerChannelMentioned = currentServerChannelId
          ? `<#${currentServerChannelId}>`
          : "Not Set";
        const currentJoinLeavesChannelId = await getGuildSetting(
          interaction.guild.id,
          {
            group: "modlog",
            setting: "joinLeavesChannelId",
          }
        );
        const currentJoinLeavesChannelMentioned = currentJoinLeavesChannelId
          ? `<#${currentJoinLeavesChannelId}>`
          : "Not Set";
        await interaction.reply({
          content:
            i18next.t("settings.CURRENT_MODLOG_CHANNEL", {
              modLogType: "default",
              channel: currentMainChannelMentioned,
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_CHANNEL", {
              modLogType: "message",
              channel: currentMessagesChannelMentioned,
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_CHANNEL", {
              modLogType: "member",
              channel: currentMembersChannelMentioned,
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_CHANNEL", {
              modLogType: "server",
              channel: currentServerChannelMentioned,
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_CHANNEL", {
              modLogType: "join/leaves",
              channel: currentJoinLeavesChannelMentioned,
            }),
        });
      } else {
        let response = "";
        if (mainChannelRaw) {
          const newMainChannel = await validTextChannel(
            client,
            mainChannelRaw.id
          );
          if (!newMainChannel) {
            response += i18next.t("settings.MODLOG_CHANNEL_INVALID", {
              modLogType: "default",
            });
          } else {
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "mainChannelId",
              value: newMainChannel.id,
            });
            response += i18next.t("settings.SET_MODLOG_CHANNEL_SUCCESS", {
              modLogType: "default",
              channel: `<#${newMainChannel.id}>`,
            });
          }
        }
        if (messagesChannelRaw) {
          const newMessagesChannel = await validTextChannel(
            client,
            messagesChannelRaw.id
          );
          if (!newMessagesChannel) {
            response +=
              "\n" +
              i18next.t("settings.MODLOG_CHANNEL_INVALID", {
                modLogType: "message",
              });
          } else {
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "messagesChannelId",
              value: newMessagesChannel.id,
            });
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "logMessages",
              value: true,
            });
            response +=
              "\n" +
              i18next.t("settings.SET_MODLOG_CHANNEL_SUCCESS", {
                modLogType: "message",
                channel: `<#${newMessagesChannel.id}>`,
              });
          }
        }
        if (membersChannelRaw) {
          const newMembersChannel = await validTextChannel(
            client,
            membersChannelRaw.id
          );
          if (!newMembersChannel) {
            response +=
              "\n" +
              i18next.t("settings.MODLOG_CHANNEL_INVALID", {
                modLogType: "member",
              });
          } else {
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "membersChannelId",
              value: newMembersChannel.id,
            });
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "logMembers",
              value: true,
            });
            response +=
              "\n" +
              i18next.t("settings.SET_MODLOG_CHANNEL_SUCCESS", {
                modLogType: "member",
                channel: `<#${newMembersChannel.id}>`,
              });
          }
        }
        if (serverChannelRaw) {
          const newServerChannel = await validTextChannel(
            client,
            serverChannelRaw.id
          );
          if (!newServerChannel) {
            response +=
              "\n" +
              i18next.t("settings.MODLOG_CHANNEL_INVALID", {
                modLogType: "server",
              });
          } else {
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "serverChannelId",
              value: newServerChannel.id,
            });
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "logServer",
              value: true,
            });
            response +=
              "\n" +
              i18next.t("settings.SET_MODLOG_CHANNEL_SUCCESS", {
                modLogType: "server",
                channel: `<#${newServerChannel.id}>`,
              });
          }
        }
        if (joinLeavesChannelRaw) {
          const newJoinLeavesChannel = await validTextChannel(
            client,
            joinLeavesChannelRaw.id
          );
          if (!newJoinLeavesChannel) {
            response +=
              "\n" +
              i18next.t("settings.MODLOG_CHANNEL_INVALID", {
                modLogType: "join/leaves",
              });
          } else {
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              value: "joinLeavesChannelId",
              setting: newJoinLeavesChannel.id,
            });
            await setGuildSetting(interaction.guild.id, {
              group: "modlog",
              setting: "logJoinLeaves",
              value: true,
            });
            response +=
              "\n" +
              i18next.t("settings.SET_MODLOG_CHANNEL_SUCCESS", {
                modLogType: "join/leave",
                channel: `<#${newJoinLeavesChannel.id}>`,
              });
          }
        }
        await interaction.reply({ content: response });
        return;
      }
    } else if (subCommand == "log") {
      const logMessages = interaction.options.getBoolean("messages");
      const logMembers = interaction.options.getBoolean("members");
      const logServer = interaction.options.getBoolean("server");
      const logJoinLeaves = interaction.options.getBoolean("joinleaves");
      if (
        typeof logMessages != "boolean" &&
        typeof logMembers != "boolean" &&
        typeof logServer != "boolean" &&
        typeof logJoinLeaves != "boolean"
      ) {
        const currentlogMessagesSetting =
          (await getGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logMessages",
          })) ?? false;
        const currentLogMembersSetting =
          (await getGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logMembers",
          })) ?? false;
        const currentLogServerSetting =
          (await getGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logServer",
          })) ?? false;
        const currentLogJoinLeavesSetting =
          (await getGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logJoinLeaves",
          })) ?? false;
        await interaction.reply({
          content:
            i18next.t("settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED", {
              event: "message",
              toggle: booleanToHuman(currentlogMessagesSetting),
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED", {
              event: "member",
              toggle: booleanToHuman(currentLogMembersSetting),
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED", {
              event: "server",
              toggle: booleanToHuman(currentLogServerSetting),
            }) +
            "\n" +
            i18next.t("settings.CURRENT_MODLOG_EVENTS_ENABLED_DISABLED", {
              event: "join/leave",
              toggle: booleanToHuman(currentLogJoinLeavesSetting),
            }),
        });
      } else {
        let response = "";
        if (typeof logMessages == "boolean") {
          await setGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logMessages",
            value: logMessages,
          });
          response += i18next.t(
            "settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS",
            {
              event: "message",
              toggle: booleanToHuman(logMessages),
            }
          );
        }
        if (typeof logMembers == "boolean") {
          await setGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logServer",
            value: logServer,
          });
          response +=
            "\n" +
            i18next.t("settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS", {
              event: "member",
              toggle: booleanToHuman(logMembers),
            });
        }
        if (typeof logServer == "boolean") {
          await setGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logServer",
            value: logServer,
          });
          response +=
            "\n" +
            i18next.t("settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS", {
              event: "server",
              toggle: booleanToHuman(logServer),
            });
        }
        if (typeof logJoinLeaves == "boolean") {
          await setGuildSetting(interaction.guild.id, {
            group: "modlog",
            setting: "logJoinLeaves",
            value: logJoinLeaves,
          });
          response +=
            "\n" +
            i18next.t("settings.SET_MODLOG_EVENTS_ENABLED_DISABLED_SUCCESS", {
              event: "join/leave",
              toggle: booleanToHuman(logJoinLeaves),
            });
        }
        await interaction.reply({ content: response });
        return;
      }
    }
  } else if (subCommandGroup == "roles") {
    const reactionRoleDatabaseId = interaction.options.getString("messagename");
    if (
      !ObjectID.isValid(reactionRoleDatabaseId) &&
      subCommand != "createmessage"
    ) {
      console.log(reactionRoleDatabaseId);
      interaction.reply({ content: "Nono" });
      return;
    }
    if (subCommand == "add") {
      const reactionRoleDatabaseId =
        interaction.options.getString("messagename");
      const reactionRoleObject = await prisma.reactionRoleMessages.findFirst({
        where: {
          AND: [
            { id: reactionRoleDatabaseId },
            { guildId: interaction.guild.id },
          ],
        },
      });
      if (!reactionRoleObject) {
        interaction.reply({
          content: i18next.t("settings.REACTION_ROLE_MESSAGE_DOESNT_EXIST"),
          ephemeral: true,
        });
        return;
      }
      const role = interaction.options.getRole("role");
      if (reactionRoleObject.roleIds.includes(role.id)) {
        return interaction.reply({
          content: i18next.t("settings.SUCCESSFULLY_ADDED_ROLE_TO_MESSAGE", {
            role: role.name,
          }),
          ephemeral: true,
        });
      }
      if (role.managed) {
        interaction.reply({
          content: i18next.t("settings.ROLE_IS_MANAGED"),
          ephemeral: true,
        });
        return;
      }
      if (reactionRoleObject.roleIds.includes(role.id)) {
        interaction.reply({
          content: i18next.t("settings.ROLE_ALREADY_IN_MESSAGE"),
          ephemeral: true,
        });
        return;
      }
      if (reactionRoleObject.roleIds.length >= 25) {
        interaction.reply({
          content: i18next.t("settings.TOO_MANY_ROLES_ON_MESSAGE"),
          ephemeral: true,
        });
        return;
      }
      reactionRoleObject.roleIds.push(role.id);
      await prisma.reactionRoleMessages.update({
        where: {
          id: reactionRoleDatabaseId,
        },
        data: {
          roleIds: reactionRoleObject.roleIds,
        },
      });
      interaction.reply({
        content: i18next.t("settings.SUCCESSFULLY_ADDED_ROLE_TO_MESSAGE"),
      });
    } else if (subCommand == "remove") {
      const reactionRoleDatabaseId =
        interaction.options.getString("messagename");
      const reactionRoleObject = await prisma.reactionRoleMessages.findFirst({
        where: {
          AND: [
            { id: reactionRoleDatabaseId },
            { guildId: interaction.guild.id },
          ],
        },
      });
      if (!reactionRoleObject) {
        interaction.reply({
          content: i18next.t("settings.REACTION_ROLE_MESSAGE_DOESNT_EXIST"),
          ephemeral: true,
        });
        return;
      }
      const role = interaction.options.getRole("role");
      if (!reactionRoleObject.roleIds.includes(role.id)) {
        interaction.reply({
          content: i18next.t("settings.ROLE_NOT_IN_MESSAGE"),
          ephemeral: true,
        });
        return;
      }
      reactionRoleObject.roleIds = removeItemFromArray(
        reactionRoleObject.roleIds,
        role.id
      );
      await prisma.reactionRoleMessages.update({
        where: {
          id: reactionRoleDatabaseId,
        },
        data: {
          roleIds: reactionRoleObject.roleIds,
        },
      });
      interaction.reply({
        content: i18next.t("settings.SUCCESSFULLY_REMOVED_ROLE_FROM_MESSAGE"),
      });
    } else if (subCommand == "createmessage") {
      const reactionRoleMessages = await prisma.reactionRoleMessages.findMany({
        where: {
          guildId: interaction.guild.id,
        },
      });
      if (reactionRoleMessages.length == 5) {
        interaction.reply({
          content: i18next.t("settings.REACTION_ROLES_NO_MORE_THAN", {
            maxAmount: 5,
          }),
          ephemeral: true,
        });
        return;
      }
      const messageName = interaction.options.getString("name");
      for (const reactionMessage of reactionRoleMessages) {
        if (reactionMessage.name == messageName) {
          interaction.reply({
            content: i18next.t(
              "settings.ALREADY_REACTION_ROLE_MESSAGE_WITH_NAME"
            ),
            ephemeral: true,
          });
          return;
        }
      }
      await prisma.reactionRoleMessages.create({
        data: {
          guildId: interaction.guild.id,
          name: messageName,
          roleIds: [],
        },
      });
      interaction.reply({
        content: i18next.t("settings.REACTION_ROLE_MESSAGE_CREATE_SUCCESS"),
      });
    } else if (subCommand == "deletemessage") {
      const reactionRoleDatabaseId =
        interaction.options.getString("messagename");
      const reactionRoleObject = await prisma.reactionRoleMessages.findFirst({
        where: {
          AND: [
            { id: reactionRoleDatabaseId },
            { guildId: interaction.guild.id },
          ],
        },
      });
      if (!reactionRoleObject) {
        interaction.reply({
          content: i18next.t("settings.REACTION_ROLE_MESSAGE_DOESNT_EXIST"),
          ephemeral: true,
        });
        return;
      }
      try {
        const channel = await interaction.client.channels.fetch(
          reactionRoleObject.channelId
        );
        if (channel.isText()) {
          const message = await channel.messages.fetch(
            reactionRoleObject.messageId
          );
          await message.delete();
        }
      } catch {
        // So much error tracking
      }
      await prisma.reactionRoleMessages.delete({
        where: {
          id: reactionRoleDatabaseId,
        },
      });
      interaction.reply({
        content: i18next.t("settings.SUCCESSFULLY_DELETED_REACTION_MESSAGE"),
      });
    } else if (
      subCommand == "sendmessage" ||
      subCommand == "regeneratemessage"
    ) {
      const reactionRoleDatabaseId =
        interaction.options.getString("messagename");
      const reactionRoleObject = await prisma.reactionRoleMessages.findFirst({
        where: {
          AND: [
            { id: reactionRoleDatabaseId },
            { guildId: interaction.guild.id },
          ],
        },
      });
      if (!reactionRoleObject) {
        interaction.reply({
          content: i18next.t("settings.REACTION_ROLE_MESSAGE_DOESNT_EXIST"),
          ephemeral: true,
        });
        return;
      }
      const roleNames = [];
      let messageContent =
        interaction.options.getString("messagecontent") ?? "";
      const makeMessageContent = !messageContent;
      const emojis = [];
      for (const roleId of reactionRoleObject.roleIds) {
        try {
          const emoji = randomEmoji();
          emojis.push(emoji);
          const role = await interaction.guild.roles.fetch(roleId);
          roleNames.push(role.name);
          if (makeMessageContent) {
            messageContent += `${emoji} ${role.name}\n`;
          }
        } catch {
          interaction.reply({
            content: i18next.t("settings.FAILED_FETCHING_ROLE", {
              roleId: roleId,
            }),
          });
          return;
        }
      }
      const messageComponents = [];
      const roleIdsChunked = chunkArray(reactionRoleObject.roleIds, 5);
      let roleNumber = 0;
      for (let i = 0; i < roleIdsChunked.length; i++) {
        const chunk = roleIdsChunked[i];
        const row = new MessageActionRow();
        for (let j = 0; j < chunk.length; j++) {
          const button = new MessageButton()
            .setLabel(roleNames[roleNumber])
            .setCustomId("reactionRoleHandler-" + roleIdsChunked[i][j])
            .setStyle("PRIMARY")
            .setEmoji(emojis[roleNumber]);
          row.addComponents(button);
          roleNumber++;
        }
        messageComponents.push(row);
      }
      const embed = new MessageEmbed()
        .setTitle("Reaction Roles")
        .setDescription(messageContent)
        // @ts-expect-error
        .setColor(randomHexCode());
      let channelId;
      if (subCommand == "sendmessage") {
        channelId = interaction.options.getChannel("channel").id;
      } else if (subCommand == "regeneratemessage") {
        channelId = (
          await prisma.reactionRoleMessages.findFirst({
            where: {
              AND: [
                { id: reactionRoleDatabaseId },
                { guildId: interaction.guild.id },
              ],
            },
          })
        ).channelId;
      }
      let channel: Channel;
      try {
        channel = await interaction.guild.channels.fetch(channelId);
      } catch {
        interaction.reply({
          content: i18next.t("settings.FAILED_FETCHING_REACTION_CHANNEL"),
          ephemeral: true,
        });
        return;
      }
      if (!channel.isText()) {
        interaction.reply({
          content: i18next.t("settings.CHANNEL_IS_NOT_TEXT"),
          ephemeral: true,
        });
        return;
      }
      if (subCommand == "sendmessage") {
        try {
          const message = await channel.send({
            embeds: [embed],
            components: messageComponents,
          });
          await prisma.reactionRoleMessages.update({
            where: {
              id: reactionRoleDatabaseId,
            },
            data: {
              channelId: channel.id,
              messageId: message.id,
            },
          });
        } catch {
          interaction.reply({
            content: i18next.t("settings.FAILED_SENDING_REACTION_MESSAGE"),
            ephemeral: true,
          });
          return;
        }
        interaction.reply({
          content: i18next.t("settings.SUCCESSFULLY_SEND_REACTION_MESSAGE"),
        });
      } else if (subCommand == "regeneratemessage") {
        try {
          const message = await channel.messages.fetch(
            reactionRoleObject.messageId
          );
          await message.edit({
            embeds: [embed],
            components: messageComponents,
          });
        } catch {
          interaction.reply({
            content: i18next.t("settings.FAILED_EDITING_REACTION_MESSAGE"),
            ephemeral: true,
          });
          return;
        }
        interaction.reply({
          content: i18next.t("settings.SUCCESSFULLY_EDITED_REACTION_MESSAGE"),
        });
      }
    }
  }
}

export async function executeAutocomplete(
  client: BotClient,
  interaction: AutocompleteInteraction
) {
  const subCommandGroup = interaction.options.getSubcommandGroup();
  // const subCommand = interaction.options.getSubcommand()
  const matchedChoices = [];
  if (subCommandGroup == "roles") {
    const input = interaction.options.getFocused(true);
    if (input.name == "messagename") {
      const reactionRoleMessages = await prisma.reactionRoleMessages.findMany({
        where: {
          guildId: interaction.guild.id,
        },
      });
      if (!reactionRoleMessages.length) {
        interaction.respond([]);
        return;
      }
      for (const reactionRoleMessage of reactionRoleMessages) {
        if (
          reactionRoleMessage.name
            .toLowerCase()
            .startsWith(String(input.value).toLowerCase())
        ) {
          matchedChoices.push({
            name: reactionRoleMessage.name,
            value: reactionRoleMessage.id,
          });
        }
      }
      interaction.respond(matchedChoices);
    }
  }
}
