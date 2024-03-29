/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChatInputCommandInteraction,
  ColorResolvable,
  Message,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import { Dispatcher, request } from "undici";
import { randomInt } from "../../functions/util";
import Sentry from "../../functions/sentry";
import i18next from "i18next";

interface Definition {
  definition: string;
  permalink: string;
  thumbs_up: number;
  sound_urls: Array<string> | null;
  author: string | null;
  word: string;
  defid: string;
  current_vote: string | null;
  written_on: Date;
  example: string | null;
  thumbs_down: number;
}

interface UrbanDictionaryResponse {
  list: Array<Definition>;
}

const cache = new Map<string, UrbanDictionaryResponse>();
export const name = "urban";
export const description = "Defines a word using urban dictionary";
export const usage = "urban word";
export const allowInDm = false;
export const rateLimit = 3;
export const slashData = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("The word to define")
      .setRequired(true)
  );

const colours: Array<ColorResolvable> = [
  "#805D93",
  "#F49FBC",
  "#FFD3BA",
  "#9EBD6E",
  "#169873",
  "#540D6E",
  "#EE4266",
];

async function returnDefineEmbed(wordToDefine: string) {
  let response: Dispatcher.ResponseData;
  const cachedValue = cache.get(wordToDefine);
  if (!cachedValue) {
    let error: string;
    try {
      response = await request(
        "https://api.urbandictionary.com/v0/define?term=" +
          encodeURIComponent(wordToDefine)
      );
    } catch (err) {
      Sentry.captureException(err);
      error = String(err);
    }
    if (error || response.statusCode != 200) {
      // @ts-expect-error
      cache.set(wordToDefine, "NOT_FOUND");
    } else {
      cache.set(wordToDefine, await response.body.json());
    }
  }
  const jsonResponse: UrbanDictionaryResponse | "NOT_FOUND" =
    cache.get(wordToDefine);
  // @ts-expect-error
  if (jsonResponse == "NOT_FOUND" || !jsonResponse.list[0]) {
    const embed = new EmbedBuilder();
    embed.setDescription(
      i18next.t("define.NO_DEFINITIONS", { word: wordToDefine })
    );
    embed.setColor(colours[colours.length - 1]);
    return embed;
  }
  const embed = new EmbedBuilder();
  embed.setColor(colours[randomInt(0, colours.length - 1)]);
  embed.setTitle(i18next.t("urban.URBAN_TITLE", { word: wordToDefine }));
  let definition = String(jsonResponse.list[0].definition).replace(/[|]/g, "");
  if (definition.length > 1024)
    definition = definition.substring(0, 1024 - 3) + "...";
  embed.addFields([{ name: i18next.t("urban.DEFINITION"), value: definition }]);
  let example = String(jsonResponse.list[0].example).replace(/[|]/g, "");
  if (example.length > 1024) example = example.substring(0, 1024 - 3) + "...";
  example &&
    embed.addFields([{ name: i18next.t("urban.EXAMPLE"), value: example }]);
  return embed;
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  await message.reply(i18next.t("general:ONLY_SLASH_COMMAND"));
  // message.channel.send({ embeds: [await returnDefineEmbed(args[0])] })
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();
  const word = interaction.options.getString("word");
  const embed = await returnDefineEmbed(word);
  await interaction.editReply({ embeds: [embed] });
}
