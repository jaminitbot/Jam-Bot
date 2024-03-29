import {
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import { request } from "undici";
import { Logger } from "winston";
import Sentry from "../../functions/sentry";
import i18next from "i18next";
import { GITHUB_CHANGELOG_LINK as changelogUrl } from "../../consts";
const cache = new Map();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateDateFromEntry(entry: Record<string, any>) {
  if (!entry) throw new Error("No entry specified");
  if (entry.date) {
    return `<t:${Math.floor(entry.date / 1000)}:R>`;
  } else {
    return "N/A";
  }
}

interface ChangelogEntry {
  title: string;
  description: string;
  date: number | undefined;
}

type ChangelogResponse = Array<ChangelogEntry>;

export const name = "changelog";
export const description = "Displays the latest changes to the bot";
export const usage = "changelog";
export const aliases = ["changes", "change"];
export const allowInDm = true;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addIntegerOption((option) =>
    option
      .setName("changeid")
      .setDescription("The change ID to get")
      .setRequired(false)
  );

async function returnChangelogEmbed(
  changeNumber: number = null,
  logger: Logger
) {
  const embed = new EmbedBuilder();
  embed.setTitle(i18next.t("changelog.CHANGELOG"));
  let log: ChangelogResponse = cache.get("log");
  if (!log) {
    logger.debug(
      "Cache not hit, attempting to retrieve changelog from github..."
    );
    const response = await request(changelogUrl);
    if (response.statusCode != 200) {
      logger.warn(
        "changelog: github seems to be returning non-standard status codes"
      );
      embed.setDescription(i18next.t("changelog.ERROR_DOWNLOADING"));
      Sentry.captureMessage("Github returned non-standard status code");
      return [embed, true];
    }
    log = await response.body.json();
    cache.set("log", log);
    setTimeout(() => {
      cache.delete("log");
    }, 30 * 60 * 1000);
  }
  if (!changeNumber) {
    let count = 0;
    // @ts-ignore
    for (let i = log.length - 1; i >= 0; i -= 1) {
      count++;
      embed.addFields([
        {
          name: i18next.t("changelog.CHANGE_TITLE", {
            id: i + 1,
            title: log[i].title,
          }),
          value: i18next.t("changelog.CHANGE_DESCRIPTION", {
            date: generateDateFromEntry(log[i]),
            description: log[i].description,
          }),
        },
      ]);
      if (count == 3) break;
    }
  } else {
    if (log[changeNumber - 1]) {
      embed.addFields([
        {
          name: i18next.t("changelog.CHANGE_TITLE", {
            id: changeNumber,
            title: log[changeNumber - 1].title,
          }),
          value: i18next.t("changelog.CHANGE_DESCRIPTION", {
            date: generateDateFromEntry(log[changeNumber - 1]),
            description: log[changeNumber - 1].description,
          }),
        },
      ]);
    } else {
      embed.setDescription(
        i18next.t("changelog.NO_CHANGE_FOUND_POSITION", {
          position: changeNumber,
        })
      );
      return [embed, false];
    }
  }
  embed.setDescription(
    i18next.t("changelog.MORE_DETAILED_CHANGELOG", {
      url: "https://jambot.jaminit.co.uk/#/changelog",
    })
  );
  return [embed, false];
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
  interaction: ChatInputCommandInteraction
) {
  const changelogEntryNumber = interaction.options.getInteger("changeid");
  const embedObject = await returnChangelogEmbed(
    changelogEntryNumber,
    client.logger
  );
  // @ts-expect-error
  await interaction.reply({
    embeds: [embedObject[0]],
    ephemeral: embedObject[1],
  });
}
