import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { BotClient } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import i18next from "i18next";

import dayjs from "dayjs";
export const name = "debug";
export const description = "Displays debug information";
export const permissions = ["MANAGE_GUILD"];
export const usage = "debug";
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description);

function returnDebugEmbed(
	sentMessageTimestamp: number,
	newMessageTimestamp: number,
	clientUptime: number,
	websocketPing: number,
	guildId: string
) {
	const embed = new MessageEmbed();
	embed.setTitle(i18next.t("debug.DEBUG_INFORMATION"));
	embed.addField(
		i18next.t("debug.ROUNDTRIP"),
		`${sentMessageTimestamp - newMessageTimestamp}ms`,
		true
	);
	embed.addField(i18next.t("debug.API_LATENCY"), `${websocketPing}ms`, true);
	const uptimeDate = dayjs(Date.now() - clientUptime).format(
		"HH:mm:ss [-] DD/MM/YYYY"
	);
	embed.addField(i18next.t("debug.UPTIME"), uptimeDate.toString(), true);
	embed.addField(i18next.t("debug.GUILD_ID"), guildId, true);
	embed.setTimestamp(Date.now());
	embed.setColor("#222E50");
	return embed;
}
export async function execute(
	client: BotClient,
	message: Message,
	args: Array<unknown>
) {
	const sentMessage = await message.channel.send("Loading...");
	const embed = returnDebugEmbed(
		sentMessage.createdTimestamp,
		message.createdTimestamp,
		client.uptime,
		client.ws.ping,
		message.guild.id
	);
	embed.setFooter(
		i18next.t("general:INITIATED_BY", { tag: message.author.tag }),
		message.author.displayAvatarURL()
	);
	sentMessage.edit({ content: null, embeds: [embed] });
}
export async function executeSlash(
	client: BotClient,
	interaction: CommandInteraction
) {
	const initiatedSlash = await interaction.deferReply({ fetchReply: true });
	if (initiatedSlash.type != "APPLICATION_COMMAND") return;
	const embed = returnDebugEmbed(
		initiatedSlash.createdTimestamp,
		interaction.createdTimestamp,
		client.uptime,
		client.ws.ping,
		interaction.guild.id
	);
	interaction.editReply({ embeds: [embed] });
}
