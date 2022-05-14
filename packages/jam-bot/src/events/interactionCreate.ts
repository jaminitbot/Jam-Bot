import { BotClient } from "../customDefinitions";
import { Interaction } from "discord.js";
import { getGuildSetting } from "../functions/db";
import {
  checkPermissions,
  checkRateLimit,
  getRateLimitRemaining,
  setRateLimit,
} from "../functions/util";
import { capitaliseSentence } from "@jaminitbot/bot-utils";
import {
  getErrorMessage,
  getInvalidPermissionsMessage,
} from "../functions/messages";
import Sentry from "../functions/sentry";
import "@sentry/tracing";
import i18next from "i18next";
import { incrementInteractionCounter } from "../functions/metrics";
import { GLOBAL_RATELIMIT_DURATION } from "../consts";

export const name = "interactionCreate";

export async function register(client: BotClient, interaction: Interaction) {
  const guildId = interaction.guild ? interaction.guild.id : 0;
  let commandName: string;
  if (
    interaction.isCommand() ||
    interaction.isContextMenu() ||
    interaction.isAutocomplete()
  ) {
    commandName = interaction.commandName;
  } else if (interaction.isButton() || interaction.isSelectMenu()) {
    const nameObject = interaction.customId.trim().split("-");
    commandName = nameObject[0];
  } else {
    return;
  }
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) {
    return;
  }
  if (
    interaction.channel?.type == "GUILD_PUBLIC_THREAD" ||
    interaction.channel?.type == "GUILD_PRIVATE_THREAD"
  ) {
    try {
      await interaction.channel.join();
      // eslint-disable-next-line no-empty
    } catch {}
  }
  if (checkRateLimit(command.name, command.rateLimit, interaction.user.id)) {
    if (
      interaction.isCommand() ||
      interaction.isButton() ||
      interaction.isContextMenu() ||
      interaction.isSelectMenu()
    ) {
      const commandRateLimit = command.rateLimit ?? GLOBAL_RATELIMIT_DURATION;
      await interaction.reply({
        content: i18next.t("general:RATE_LIMIT_HIT", {
          time: commandRateLimit * 1000,
          timeLeft: getRateLimitRemaining(
            command.name,
            command.rateLimit,
            interaction.user.id
          ),
        }),
        ephemeral: true,
      });
    }
    return;
  }
  setRateLimit(command.name, interaction.user.id);
  if (command.permissions) {
    // @ts-expect-error
    if (!checkPermissions(interaction.member, [...command.permissions])) {
      // User doesn't have specified permissions to run command
      client.logger.debug(
        `messageHandler: User ${
          interaction.user.tag
        } doesn't have the required permissions to run command ${
          // @ts-expect-error
          interaction.commandName ?? "NULL"
        }`
      );
      if (
        interaction.isCommand() ||
        interaction.isButton() ||
        interaction.isContextMenu() ||
        interaction.isSelectMenu()
      ) {
        await interaction.reply({
          content: getInvalidPermissionsMessage(),
          ephemeral: true,
        });
      }
      return;
    }
  }
  if (interaction.isCommand()) {
    // Is a slash command
    if (typeof command.executeSlash != "function") {
      const prefix =
        (await getGuildSetting(guildId, "prefix")) || process.env.defaultPrefix;
      await interaction.reply({
        content: i18next.t("events:interactionCreate.SLASH_FUNCTION_NULL", {
          prefix: prefix,
          command: command.name,
        }),
        ephemeral: true,
      });
      return;
    }
    Sentry.withInteractionScope(interaction, async () => {
      const transaction = Sentry.startTransaction({
        op: command.name + "Command",
        name: capitaliseSentence(command.name) + " Command",
      });
      try {
        await command.executeSlash(client, interaction);
      } catch (error) {
        Sentry.captureException(error);
        // Error running command
        client.logger.error(
          "interactionHandler: Command failed with error: " + error
        );
        try {
          if (interaction.deferred) {
            try {
              await interaction.editReply({
                content: getErrorMessage(),
              });
              // eslint-disable-next-line no-empty
            } catch {}
          } else {
            try {
              await interaction.reply({ content: getErrorMessage() });
              // eslint-disable-next-line no-empty
            } catch {}
          }
          // eslint-disable-next-line no-empty
        } catch (err) {
          Sentry.captureException(err);
        }
        if (process.env.NODE_ENV != "production") {
          throw error;
        }
      } finally {
        transaction.finish();
      }
    });
    incrementInteractionCounter(
      "command",
      commandName,
      interaction.guild?.id ?? null
    );
  } else if (interaction.isButton()) {
    if (typeof command.executeButton != "function") return;
    Sentry.withInteractionScope(interaction, async () => {
      const transaction = Sentry.startTransaction({
        op: command.name + "Command",
        name: capitaliseSentence(command.name) + " Command",
      });
      try {
        await command.executeButton(client, interaction);
      } catch (error) {
        Sentry.captureException(error);
        // Error running command
        client.logger.error(
          "interactionHandler: Command button failed with error: " + error
        );
      } finally {
        transaction.finish();
      }
    });
    incrementInteractionCounter(
      "button",
      commandName,
      interaction.guild?.id ?? null
    );
  } else if (interaction.isContextMenu()) {
    if (typeof command.executeContextMenu != "function") return;
    Sentry.withInteractionScope(interaction, async () => {
      const transaction = Sentry.startTransaction({
        op: command.name + "Command",
        name: capitaliseSentence(command.name) + " Command",
      });
      try {
        await command.executeContextMenu(client, interaction);
      } catch (error) {
        // Error running command
        client.logger.error(
          "interactionHandler: Command button failed with error: " + error
        );
      } finally {
        transaction.finish();
      }
    });
    incrementInteractionCounter(
      "context_menu",
      commandName,
      interaction.guild?.id ?? null
    );
  } else if (interaction.isAutocomplete()) {
    if (typeof command.executeAutocomplete != "function") return;
    Sentry.withInteractionScope(interaction, async () => {
      const transaction = Sentry.startTransaction({
        op: command.name + "Command",
        name: capitaliseSentence(command.name) + " Command",
      });
      try {
        await command.executeAutocomplete(client, interaction);
      } catch (error) {
        // Error running command
        client.logger.error(
          "interactionHandler: Command button failed with error: " + error
        );
      } finally {
        transaction.finish();
      }
    });
    incrementInteractionCounter(
      "autocomplete",
      commandName,
      interaction.guild?.id ?? null
    );
  } else if (interaction.isSelectMenu()) {
    if (typeof command.executeSelectMenu != "function") return;
    Sentry.withInteractionScope(interaction, async () => {
      const transaction = Sentry.startTransaction({
        op: command.name + "Command",
        name: capitaliseSentence(command.name) + " Command",
      });
      try {
        await command.executeSelectMenu(client, interaction);
      } catch (error) {
        // Error running command
        client.logger.error(
          "interactionHandler: Command button failed with error: " + error
        );
      } finally {
        transaction.finish();
      }
    });
    incrementInteractionCounter(
      "select_menu",
      commandName,
      interaction.guild?.id ?? null
    );
  }
}
