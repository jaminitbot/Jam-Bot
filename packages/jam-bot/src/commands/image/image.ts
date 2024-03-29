import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import { request } from "undici";
import { Logger } from "winston";
import Sentry from "../../functions/sentry";
import i18next from "i18next";
// @ts-expect-error
import isImageUrl = require("is-image-url");

const cache = new Map();
const apiHost = "https://api.bing.microsoft.com/v7.0/images/search";
const subscriptionKey = process.env.bingImageSearchKey;

export const name = "image";
export const description = "Searches the internet for an image";
export const usage = "image duck";
export const rateLimit = 5;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("The term to search for")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("The specific position to get")
      .setRequired(false)
  );

export async function searchForImage(
  search: string,
  position: number,
  nsfw: boolean,
  logger: Logger
) {
  if (!process.env.bingImageSearchKey) return i18next.t("NO_API_KEY");
  if (position && position < 1) {
    return i18next.t("image.POSITION_TOO_LOW");
  }
  let safeSearchType = "Off";
  if (!nsfw) {
    // Non-nsfw channels can't bypass safe search
    safeSearchType = "Strict";
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let responseData: any = cache.get(search);
  if (!responseData) {
    const response = await request(
      apiHost +
        "?safeSearch=" +
        safeSearchType +
        "&q=" +
        encodeURIComponent(search),
      {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      }
    );
    if (response.statusCode != 200) {
      logger.warn(
        "image: Bing image search is returning non-standard status codes"
      );
      Sentry.captureMessage(
        "Bing images is returning non-standard status codes"
      );
      return i18next.t("general:API_ERROR");
    }
    cache.set(search, (await response.body.json()).value);
    responseData = cache.get(search);
  }
  const validImageUrls = [];
  for (const result of responseData) {
    if (isImageUrl(result.contentUrl)) {
      validImageUrls.push(result.contentUrl);
    }
    if (!position && validImageUrls.length) {
      break;
    } else if (position <= validImageUrls.length) {
      break;
    }
  }
  if (position) {
    // Get specific image at position
    return (
      validImageUrls[position - 1] ||
      i18next.t("image.NO_IMAGE_FOR_POSITION", { position: position })
    );
  } else {
    return validImageUrls[0] || i18next.t("image.NO_IMAGE_FOUND");
  }
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  await message.reply(
    i18next.t("general:ONLY_SLASH_COMMAND", { command: "/image" })
  );
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();
  const search = interaction.options.getString("search");
  const position = interaction.options.getInteger("position");
  // @ts-expect-error
  const isNsfw = interaction.channel.nsfw;
  const imageUrl = await searchForImage(
    search,
    position,
    isNsfw,
    client.logger
  );
  await interaction.editReply({ content: imageUrl });
}
