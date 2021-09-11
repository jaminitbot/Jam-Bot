import { CommandInteraction, Message } from "discord.js"
import { BotClient } from '../../customDefinitions'
import { SlashCommandBuilder } from '@discordjs/builders'
import { setKey, getNestedSetting, setNestedSetting, getKey } from "../../functions/db"
import { booleanToHuman } from '../../functions/util'

export const name = 'settings'
export const description = "Configures the bot's settings"
export const permissions = ['MANAGE_SERVER']
export const usage = 'settings'
export const slashData = new SlashCommandBuilder()
	.setName(name)
	.setDescription(description)
	.addSubcommandGroup(group =>
		group.setName('general')
			.setDescription('General settings')

			.addSubcommand(command =>
				command.setName('prefix')
					.setDescription('Sets the bot\'s prefix')
					.addStringOption(option =>
						option.setName('prefix')
							.setDescription('The new prefix to use')
							.setRequired(false)
					)
			)
	)
	.addSubcommandGroup(group =>
		group.setName('suggestions')
			.setDescription('Suggestion settings')
			.addSubcommand(command =>
				command.setName('channel')
					.setDescription('Sets the suggestion channel')
					.addChannelOption(option =>
						option.setName('channel')
							.setDescription('The channel to send suggestions to')
							.setRequired(false)
					)
			)
			.addSubcommand(command =>
				command.setName('useable')
					.setDescription('Whether to allow suggestions to be made')
					.addBooleanOption(option =>
						option.setName('on')
							.setDescription('Send suggestions?')
							.setRequired(false)
					)
			)
	)
	.addSubcommandGroup(group =>
		group.setName('modlog')
			.setDescription('Mod log related settings')
			.addSubcommand(command =>
				command.setName('channels')
					.setDescription('Sets the various channels to send modlogs')
					.addChannelOption(option =>
						option.setName('main')
							.setDescription('The main channel for modlogs (used if other channels aren\'t specified')
							.setRequired(false)
					)
					.addChannelOption(option =>
						option.setName('messages')
							.setDescription('Channel to send modlogs relating to messages')
							.setRequired(false))
					.addChannelOption(option =>
						option.setName('members')
							.setDescription('Channel to send modlogs relating to member')
							.setRequired(false))
					.addChannelOption(option =>
						option.setName('server')
							.setDescription('Channel to send modlogs relating to the server')
							.setRequired(false))
					.addChannelOption(option =>
						option.setName('joinleaves')
							.setDescription('Channel to send modlogs relating to the joins/leaves')
							.setRequired(false))
			)
			.addSubcommand(command =>
				command.setName('log')
					.setDescription('Turns on/off logging of certain events')
					.addBooleanOption(option =>
						option.setName('messages')
							.setDescription('Log events related to messages?')
							.setRequired(false)
					)
					.addBooleanOption(option =>
						option.setName('members')
							.setDescription('Log events related to members?')
							.setRequired(false)
					)
					.addBooleanOption(option =>
						option.setName('server')
							.setDescription('Log events related to the server?')
							.setRequired(false)
					)
					.addBooleanOption(option =>
						option.setName('joinleaves')
							.setDescription('Log events related to joins/leaves?')
							.setRequired(false)
					)
			)
	)
async function validTextChannel(client: BotClient, channelId: string) {
	const channel = await client.channels.fetch(channelId)
	if (!channel.isText || channel.type == 'DM') {
		return null
	}
	return channel
}
export async function execute(client: BotClient, message: Message, args) {
	message.channel.send('Use slash commands smh')
}
export async function executeSlash(client: BotClient, interaction: CommandInteraction) {
	const subCommandGroup = interaction.options.getSubcommandGroup()
	const subCommand = interaction.options.getSubcommand()
	if (subCommandGroup == 'general') {
		if (subCommand == 'prefix') {
			const newPrefix = interaction.options.getString('prefix')
			if (!newPrefix) {
				interaction.reply({ content: 'The current prefix is: ' + await getKey(interaction.guild.id, 'prefix') ?? process.env.defaultPrefix })
				return
			}
			if (newPrefix.length > 10) {
				interaction.reply({ content: 'You can\'t have a prefix longer than 10 characters!', ephemeral: true })
			} else {
				await setKey(interaction.guild.id, 'prefix', newPrefix)
				interaction.reply({ content: 'Successfully set prefix to: ' + newPrefix })
			}
			return
		}
	} else if (subCommandGroup == 'suggestions') {
		if (subCommand == 'channel') {
			const newSuggestionsChannel = interaction.options.getChannel('channel')
			if (!newSuggestionsChannel) {
				const currentSuggestionChannelId = await getNestedSetting(interaction.guild.id, 'suggestions', 'channel')
				const mentionedSuggestionChannel = currentSuggestionChannelId ? `<#${currentSuggestionChannelId}>` : 'Not Set'
				interaction.reply('The current suggestion channel is: ' + mentionedSuggestionChannel)
				return
			}
			const newChannel = await client.channels.fetch(newSuggestionsChannel.id)
			if (!newChannel.isText || newChannel.type == 'DM') {
				interaction.reply({ content: 'The channel specified must be a text channel!', ephemeral: true })
			} else {
				await setNestedSetting(interaction.guild.id, 'suggestions', 'channel', newChannel.id)
				await setNestedSetting(interaction.guild.id, 'suggestions', 'enabled', true)
				try {
					// @ts-expect-error
					await newChannel.send('Suggestions will be sent here!')
				} catch {
					interaction.reply('It looks like I don\'t have permission for that channel! Check my permissions!')
					return
				}
				interaction.reply(`Sucessfully set suggestion channel to <#${newChannel.id}>`)
			}
			return
		} else if (subCommand == 'useable') {
			const sendSuggestions = interaction.options.getBoolean('on')
			if (typeof sendSuggestions != 'boolean') {
				interaction.reply('Suggestions are currently: ' + booleanToHuman(await getNestedSetting(interaction.guild.id, 'suggestions', 'enabled')))
				return
			}
			await setNestedSetting(interaction.guild.id, 'suggestions', 'enabled', sendSuggestions)
			interaction.reply('Succesfully turned suggestions: ' + booleanToHuman(sendSuggestions))
			return
		}
	} else if (subCommandGroup == 'modlog') {
		if (subCommand == 'channels') {
			const mainChannelRaw = interaction.options.getChannel('main')
			const messagesChannelRaw = interaction.options.getChannel('messages')
			const membersChannelRaw = interaction.options.getChannel('members')
			const serverChannelRaw = interaction.options.getChannel('server')
			const joinLeavesChannelRaw = interaction.options.getChannel('joinleaves')
			if (!mainChannelRaw && !messagesChannelRaw && !membersChannelRaw && !serverChannelRaw && !joinLeavesChannelRaw) {
				const currentMainChannelId = await getNestedSetting(interaction.guild.id, 'modlog', 'mainChannelId')
				const currentMainChannelMentioned = currentMainChannelId ? `<#${currentMainChannelId}>` : 'Not Set'
				const currentMessagesChannelId = await getNestedSetting(interaction.guild.id, 'modlog', 'messagesChannelId')
				const currentMessagesChannelMentioned = currentMessagesChannelId ? `<#${currentMessagesChannelId}>` : 'Not Set'
				const currentMembersChannelId = await getNestedSetting(interaction.guild.id, 'modlog', 'membersChannelId')
				const currentMembersChannelMentioned = currentMembersChannelId ? `<#${currentMembersChannelId}>` : 'Not Set'
				const currentServerChannelId = await getNestedSetting(interaction.guild.id, 'modlog', 'serverChannelId')
				const currentServerChannelMentioned = currentServerChannelId ? `<#${currentServerChannelId}>` : 'Not Set'
				const currentJoinLeavesChannelId = await getNestedSetting(interaction.guild.id, 'modlog', 'joinLeavesChannelId')
				const currentJoinLeavesChannelMentioned = currentJoinLeavesChannelId ? `<#${currentJoinLeavesChannelId}>` : 'Not Set'
				interaction.reply({
					content: `Main log channel: ${currentMainChannelMentioned}\n` +
						`Messages log channel: ${currentMessagesChannelMentioned}\n` +
						`Members log channel: ${currentMembersChannelMentioned}\n` +
						`Server log channel: ${currentServerChannelMentioned}\n` +
						`Join/Leaves log channel: ${currentJoinLeavesChannelMentioned}`
				})
			} else {
				let response = ""
				if (mainChannelRaw) {
					const newMainChannel = await validTextChannel(client, mainChannelRaw.id)
					if (!newMainChannel) {
						response += 'Main log channel specified was not a valid text channel, not changed'
					} else {
						await setNestedSetting(interaction.guild.id, 'modlog', 'mainChannelId', newMainChannel.id)
						response += `Main log channel changed to <#${newMainChannel.id}>`
					}
				}
				if (messagesChannelRaw) {
					const newMessagesChannel = await validTextChannel(client, messagesChannelRaw.id)
					if (!newMessagesChannel) {
						response += '\nMessages log channel specified was not a valid text channel, not changed'
					} else {
						await setNestedSetting(interaction.guild.id, 'modlog', 'messagesChannelId', newMessagesChannel.id)
						await setNestedSetting(interaction.guild.id, 'modlog', 'logMessages', true)
						response += `\nMessages log channel changed to <#${newMessagesChannel.id}>`
					}
				}
				if (membersChannelRaw) {
					const newMembersChannel = await validTextChannel(client, membersChannelRaw.id)
					if (!newMembersChannel) {
						response += '\nMember log channel specified was not a valid text channel, not changed'
					} else {
						await setNestedSetting(interaction.guild.id, 'modlog', 'membersChannelId', newMembersChannel.id)
						await setNestedSetting(interaction.guild.id, 'modlog', 'logMembers', true)
						response += `\nMember log channel changed to <#${newMembersChannel.id}>`
					}
				}
				if (serverChannelRaw) {
					const newServerChannel = await validTextChannel(client, serverChannelRaw.id)
					if (!newServerChannel) {
						response += '\nServer log channel specified was not a valid text channel, not changed'
					} else {
						await setNestedSetting(interaction.guild.id, 'modlog', 'serverChannelId', newServerChannel.id)
						await setNestedSetting(interaction.guild.id, 'modlog', 'logServer', true)
						response += `\nServer log channel changed to <#${newServerChannel.id}>`
					}
				}
				if (joinLeavesChannelRaw) {
					const newJoinLeavesChannel = await validTextChannel(client, joinLeavesChannelRaw.id)
					if (!newJoinLeavesChannel) {
						response += '\nJoin/Leaves log channel specified was not a valid text channel, not changed'
					} else {
						await setNestedSetting(interaction.guild.id, 'modlog', 'joinLeavesChannelId', newJoinLeavesChannel.id)
						await setNestedSetting(interaction.guild.id, 'modlog', 'logJoinLeaves', true)
						response += `\nJoin/leaves log channel changed to <#${newJoinLeavesChannel.id}>`
					}
				}
				interaction.reply({ content: response })
				return
			}
		} else if (subCommand == 'log') {
			const logMessages = interaction.options.getBoolean('messages')
			const logMembers = interaction.options.getBoolean('members')
			const logServer = interaction.options.getBoolean('server')
			const logJoinLeaves = interaction.options.getBoolean('joinleaves')
			if (typeof logMessages != 'boolean' && typeof logMembers != 'boolean' && typeof logServer != 'boolean' && typeof logJoinLeaves != 'boolean') {
				const currentlogMessagesSetting = await getNestedSetting(interaction.guild.id, 'modlog', 'logMessages') ?? false
				const currentLogMembersSetting = await getNestedSetting(interaction.guild.id, 'modlog', 'logMembers') ?? false
				const currentLogServerSetting = await getNestedSetting(interaction.guild.id, 'modlog', 'logSetting') ?? false
				const currentLogJoinLeavesSetting = await getNestedSetting(interaction.guild.id, 'modlog', 'logJoinLeaves') ?? false
				interaction.reply({
					content: `Log message events: ${booleanToHuman(currentlogMessagesSetting)}\n` +
						`Log member events: ${booleanToHuman(currentLogMembersSetting)}\n` +
						`Log server events: ${booleanToHuman(currentLogServerSetting)}\n` +
						`Log join/leaves: ${booleanToHuman(currentLogJoinLeavesSetting)}`
				})
			} else {
				let response = ""
				if (typeof logMessages == 'boolean') {
					await setNestedSetting(interaction.guild.id, 'modlog', 'logMessages', logMessages)
					response += 'Turned logging of message events: ' + booleanToHuman(logMessages)
				}
				if (typeof logMembers == 'boolean') {
					await setNestedSetting(interaction.guild.id, 'modlog', 'logMembers', logMembers)
					response += '\nTurned logging of member events: ' + booleanToHuman(logMembers)
				}
				if (typeof logServer == 'boolean') {
					await setNestedSetting(interaction.guild.id, 'modlog', 'logServer', logServer)
					response += '\nTurned logging of server events: ' + booleanToHuman(logServer)
				}
				if (typeof logJoinLeaves == 'boolean') {
					await setNestedSetting(interaction.guild.id, 'modlog', 'logJoinLeaves', logJoinLeaves)
					response += '\nTurned logging of join/leave events: ' + booleanToHuman(logJoinLeaves)
				}
				interaction.reply({ content: response })
				return
			}
		}
	}
}