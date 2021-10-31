import { CommandInteraction, Message } from "discord.js";
import { BotClient } from "../../customDefinitions";
import { SlashCommandBuilder } from "@discordjs/builders";
import i18next from "i18next";
import { getNestedSetting } from "../../functions/db";

export const name = "role";
export const description = "Adds or removes self assignable roles";
export const usage = "role";
export const allowInDm = false;
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addSubcommand((command) =>
		command
			.setName("add")
			.setDescription("Gives you a self asignable role")
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription("The role you'd like to give yourself")
					.setRequired(true)
			)
	)
	.addSubcommand((command) =>
		command
			.setName("remove")
			.setDescription("Removes a self asignable role from yourself")
			.addRoleOption((option) =>
				option
					.setName("role")
					.setDescription(
						"The role you'd like to remove from yourself"
					)
					.setRequired(true)
			)
	);
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
	if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
		return interaction.reply({
			content: i18next.t("general:BOT_INVALID_PERMISSION", {
				friendlyPermissionName: "manage roles",
				permissionName: "MANAGE_ROLES",
			}),
			ephemeral: true,
		});
	}
	const subCommand = interaction.options.getSubcommand();
	const role = interaction.options.getRole("role");
	const allowedRoles: Array<string> = await getNestedSetting(
		interaction.guild.id,
		"assignableRoles",
		"allowedRoles"
	);
	if (!allowedRoles || !allowedRoles.includes(role.id)) {
		return interaction.reply({
			content: i18next.t("role.ROLE_NOT_WHITELISTED", {
				type: subCommand,
				role: role.id,
			}),
			ephemeral: true,
		});
	}
	if (role.position > interaction.guild.me.roles.highest.position) {
		return interaction.reply({
			content: i18next.t("role.ROLE_HIGHER_THAN_ME", { role: role.id }),
			ephemeral: true,
		});
	}
	const member = await interaction.guild.members.fetch(interaction.user.id);
	if (subCommand == "add") {
		if (member.roles.cache.has(role.id)) {
			return interaction.reply({
				content: i18next.t("role.USER_ALREADY_HAS_ROLE", {
					role: role.id,
				}),
				ephemeral: true,
			});
		}
		try {
			await member.roles.add(role.id);
		} catch {
			return interaction.reply(i18next.t("role.UNKNOWN_ERROR"));
		}
	} else if (subCommand == "remove") {
		if (!member.roles.cache.has(role.id)) {
			return interaction.reply({
				content: i18next.t("role.USER_DOESNT_HAVE_ROLE", {
					role: role.id,
				}),
				ephemeral: true,
			});
		}
		try {
			await member.roles.remove(role.id);
		} catch {
			return interaction.reply(i18next.t("role.UNKNOWN_ERROR"));
		}
	}
	interaction.reply({
		content: i18next.t("role.MANAGED_SUCCESS", {
			role: role.id,
			type: subCommand,
		}),
		ephemeral: true,
	});
}
