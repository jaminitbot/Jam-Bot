import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { BotClient } from "../../customDefinitions";
import { setKey } from "../../functions/db";
import { SlashCommandBuilder } from "@discordjs/builders";
import i18next from "i18next";
import isNumber = require("is-number");

export const name = "setkey";
export const description = "Sets a db key";
export const usage = "setkey 46435456789132 blah test";
export const permissions = ["OWNER"];
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addStringOption((option) =>
		option.setName("key").setDescription("Key to get").setRequired(true)
	)
	.addStringOption((option) =>
		option.setName("value").setDescription("Value to set").setRequired(true)
	)
	.addStringOption((option) =>
		option.setName("guild").setDescription("Guild ID").setRequired(false)
	);
async function returnSetKeyEmbed(guildId, key, value) {
	try {
		await setKey(guildId, key, value);
	} catch (err) {
		const embed = new MessageEmbed();
		embed.setDescription(i18next.t("general:UNKNOWN_ERROR"));
		return embed;
	}
	const embed = new MessageEmbed();
	embed.setTitle(i18next.t("setkey.SET_KEY"));
	embed.setDescription(i18next.t("setkey.SUCCESSFULLY_SET_KEY"));
	embed.addField(i18next.t("setkey.GUILD_ID"), guildId, true);
	embed.addField(i18next.t("setkey.KEY"), key, true);
	embed.addField(i18next.t("setkey.VALU_SET"), value, true);
	embed.setTimestamp(Date.now());
	return embed;
}
export async function execute(
	client: BotClient,
	message: Message,
	args: Array<unknown>
) {
	let guild;
	let key;
	let value;
	if (!isNumber(args[0]) && !args[2]) {
		// Setting key without guild input
		guild = message.guild.id; // Use current guild
		key = args[0];
		value = args[1];
	} else if (isNumber(args[0]) && !args[2]) {
		// Guild ID inputted but no value to set
		return message.reply(i18next.t("setkey.NO_VALUE_SPECIFIED"));
	} else {
		// Using guild id
		guild = args[0];
		key = args[1];
		value = args[2];
	}
	const embed = await returnSetKeyEmbed(guild, key, value);
	embed.setFooter(
		i18next.t("general:INITIATED_BY", { tag: message.author.tag }),
		message.author.displayAvatarURL()
	);
	message.channel.send({ embeds: [embed] });
}
export async function executeSlash(
	client: BotClient,
	interaction: CommandInteraction
) {
	const guildId =
		interaction.options.getString("guildid") ?? interaction.guild.id;
	const key = interaction.options.getString("key");
	const value = interaction.options.getString("value");
	const embed = await returnSetKeyEmbed(guildId, key, value);
	interaction.reply({ embeds: [embed] });
}
