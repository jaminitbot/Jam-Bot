import { CommandInteraction, Guild, Message, TextBasedChannels } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'

export const name = 'invite'
export const description = 'Generates an invite URL for the current channel'
export const usage = 'invite'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
async function createInvite(channel: TextBasedChannels, guild: Guild) {
	if (channel.type != 'GUILD_TEXT' && channel.type != 'GUILD_NEWS') return 'This isn\'t a server channel!'
	if (!guild.me.permissions.has('CREATE_INSTANT_INVITE')) return 'I don\'t have permission to create invites, ask an admin to check if I have the Create Invite permission'
	try {
		return (await channel.createInvite({ maxAge: 0 })).url
	} catch {
		return 'An unknown error happened when trying to create that invite'
	}
}
export async function execute(client: BotClient, message: Message, args: Array<unknown>) {
	const invite = await createInvite(message.channel, message.guild)
	message.channel.send(invite)
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const invite = await createInvite(interaction.channel, interaction.guild)
	interaction.reply(invite)
}