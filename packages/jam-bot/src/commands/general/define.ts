import {
  ButtonInteraction,
  ColorResolvable,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SelectMenuInteraction,
  SlashCommandBuilder,
  SelectMenuBuilder,
  ChatInputCommandInteraction,
  ButtonStyle,
} from "discord.js";
import { BotClient } from "../../customDefinitions";
import { Dispatcher, request } from "undici";
import { capitaliseSentence } from "@jaminitbot/bot-utils";
import Sentry from "../../functions/sentry";
import i18next from "i18next";

interface PhoneticsObject {
  text: string;
  audio: string | undefined;
}

interface DefinitionsObject {
  definition: string;
  example: string | undefined;
  synonyms: Array<string> | null;
  antonyms: Array<string> | null;
}

interface MeaningsObject {
  partOfSpeech: string;
  definitions: Array<DefinitionsObject>;
}

interface WordDefinition {
  word: string;
  phonetic: string;
  phonetics: Array<PhoneticsObject> | null;
  origin: string | undefined;
  meanings: Array<MeaningsObject>;
}

const cache = new Map<string, WordDefinition>();

export const name = "define";
export const description = "Defines a word";
export const usage = "define word";
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

interface InteractionData {
  definitionStart?: number;
  definitionType?: string;
}

async function returnDefineEmbed(
  wordToDefine: string,
  interactionData: InteractionData,
  userId: string
) {
  let response: Dispatcher.ResponseData;
  const cachedValue = cache.get(wordToDefine);
  if (!cachedValue) {
    response = await request(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" +
        encodeURIComponent(wordToDefine)
    );
    if (response.statusCode == 404) {
      // @ts-expect-error
      cache.set(wordToDefine, "NOT_FOUND");
    } else if (response.statusCode != 200) {
      Sentry.captureMessage("Dictionary API returned non-standard status code");
      const embed = new EmbedBuilder();
      embed.setDescription(i18next.t("general:API_ERROR"));
      embed.setColor(colours[colours.length - 1]);
      return [[embed], null];
    } else {
      cache.set(wordToDefine, (await response.body.json())[0]);
    }
  }
  // @ts-expect-error
  if (cache.get(wordToDefine) == "NOT_FOUND") {
    const embed = new EmbedBuilder();
    embed.setDescription(
      i18next.t("define.NO_DEFINITIONS", { word: wordToDefine })
    );
    embed.setColor(colours[colours.length - 1]);
    return [[embed], null];
  }
  const jsonResponse: WordDefinition = cache.get(wordToDefine);
  const partOfSpeechTypes = [];
  const meaningsJson: Record<string, Array<DefinitionsObject>> = {};
  for (const meaning of jsonResponse.meanings) {
    partOfSpeechTypes.push({
      label: capitaliseSentence(meaning.partOfSpeech),
      value: meaning.partOfSpeech,
    });
    meaningsJson[meaning.partOfSpeech] = meaning.definitions;
  }
  const wordType =
    interactionData["definitionType"] ?? partOfSpeechTypes[0]["value"];
  const wordToDefineHiphen = wordToDefine.split(" ").join("-");
  const selectRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId("define-selectmenu-" + userId + "-" + wordToDefineHiphen)
      .setPlaceholder(capitaliseSentence(wordType))
      .addOptions(partOfSpeechTypes)
  );
  const embed = new EmbedBuilder();
  let definitionNumberStart = interactionData["definitionStart"] ?? 1;
  if (1 > definitionNumberStart) definitionNumberStart = 1;
  embed.setTitle(
    `${capitaliseSentence(
      interactionData["definitionType"] ?? partOfSpeechTypes[0]["value"]
    )}: ${capitaliseSentence(wordToDefine)}`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const definitionsArray: Array<any> = meaningsJson[wordType];
  while (definitionNumberStart <= definitionsArray.length) {
    const definition = meaningsJson[wordType][definitionNumberStart - 1];
    embed.addFields([
      {
        name: i18next.t("define.DEFINITION_TITLE", {
          definitionNumber: definitionNumberStart,
        }),
        value: `${
          capitaliseSentence(definition.definition) ?? "*Not Available*"
        }`,
      },
    ]);
    definitionNumberStart++;
    if (embed.data.fields.length == 5) {
      break;
    }
  }
  const currentPage =
    Math.round(definitionNumberStart / 5) < 0
      ? 1
      : Math.round(definitionNumberStart / 5);
  const totalPages = Math.ceil(definitionsArray.length / 5);
  embed.setColor(colours[currentPage]);
  embed.setFooter({
    text: i18next.t("define.PAGE_NUMBER", {
      currentPage: currentPage,
      totalPages: totalPages,
    }),
  });
  const buttonsRow = new ActionRowBuilder();
  if (1 < interactionData["definitionStart"] ?? 1) {
    buttonsRow.addComponents(
      new ButtonBuilder()
        .setCustomId(
          "define-button-" +
            (interactionData["definitionStart"] - 5) +
            "-" +
            wordType +
            "-" +
            userId +
            "-" +
            wordToDefineHiphen
        )
        .setLabel(i18next.t("define.PREVIOUS_PAGE"))
        .setStyle(ButtonStyle.Secondary)
    );
  } else {
    buttonsRow.addComponents(
      new ButtonBuilder()
        .setCustomId("define-button-disabled")
        .setDisabled(true)
        .setLabel(i18next.t("define.PREVIOUS_PAGE"))
        .setStyle(ButtonStyle.Secondary)
    );
  }
  if (definitionNumberStart < definitionsArray.length) {
    buttonsRow.addComponents(
      new ButtonBuilder()
        .setCustomId(
          "define-button-" +
            definitionNumberStart +
            "-" +
            wordType +
            "-" +
            userId +
            "-" +
            wordToDefineHiphen
        )
        .setLabel(i18next.t("define.NEXT_PAGE"))
        .setStyle(ButtonStyle.Secondary)
    );
  } else {
    buttonsRow.addComponents(
      new ButtonBuilder()
        .setCustomId("define-button-disabled2")
        .setDisabled(true)
        .setLabel(i18next.t("define.NEXT_PAGE"))
        .setStyle(ButtonStyle.Primary)
    );
  }
  return [[embed], [buttonsRow, selectRow]];
}

export async function execute(
  client: BotClient,
  message: Message,
  args: Array<unknown>
) {
  message.channel.send(i18next.t("ONLY_SLASH_COMMAND", { command: name }));
}

export async function executeSlash(
  client: BotClient,
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply();
  const wordToDefine = interaction.options.getString("word");
  const embed = await returnDefineEmbed(
    wordToDefine.toLowerCase(),
    {},
    interaction.user.id
  );
  // @ts-expect-error
  await interaction.editReply({ embeds: embed[0], components: embed[1] });
}

export async function executeButton(
  client: BotClient,
  interaction: ButtonInteraction
) {
  const interactionNameObject = interaction.customId.split("-");
  const interactionData = {
    definitionStart: parseInt(interactionNameObject[2]),
    definitionType: interactionNameObject[3],
  };
  const eph = interactionNameObject[4] != interaction.user.id;
  const wordToDefine = interactionNameObject.splice(5).join(" ");
  const defineEmbedData = await returnDefineEmbed(
    wordToDefine,
    interactionData,
    interaction.user.id
  );
  if (eph) {
    // @ts-expect-error
    await interaction.reply({
      embeds: defineEmbedData[0],
      components: defineEmbedData[1],
      ephemeral: true,
    });
  } else {
    // @ts-expect-error
    await interaction.update({
      embeds: defineEmbedData[0],
      components: defineEmbedData[1],
    });
  }
}

export async function executeSelectMenu(
  client: BotClient,
  interaction: SelectMenuInteraction
) {
  const interactionNameObject = interaction.customId.split("-");
  const interactionData = { definitionType: interaction.values[0] };
  const eph = interactionNameObject[2] != interaction.user.id;
  const wordToDefine = interactionNameObject.splice(3).join(" ");
  const defineEmbedData = await returnDefineEmbed(
    wordToDefine,
    interactionData,
    interaction.user.id
  );
  if (eph) {
    // @ts-expect-error
    await interaction.reply({
      embeds: defineEmbedData[0],
      components: defineEmbedData[1],
      ephemeral: true,
    });
  } else {
    // @ts-expect-error
    await interaction.update({
      embeds: defineEmbedData[0],
      components: defineEmbedData[1],
    });
  }
}
