import * as Sentry from '@sentry/node'
import { Interaction, Message } from 'discord.js'
import { RewriteFrames } from '@sentry/integrations'

export default (() => {
	if (process.env.NODE_ENV === 'production' && process.env.sentryUrl) {
		Sentry.init({
			dsn: process.env.sentryUrl,
			tracesSampleRate: 1.0,
			environment: process.env.NODE_ENV ?? 'development',
			debug: process.env.NODE_ENV ? false : true,
			integrations: [
				new RewriteFrames({
					// @ts-expect-error
					root: global.__rootdir__,
				}),
			],
		})
	}
	return {
		...Sentry,
		/**
		 * Adds Message context to Sentry for better error reporting.
		 * @param {Message} message - Message to configure scope with
		 * @param {Function} fn - Handler function to call within the configured scope
		 */
		// eslint-disable-next-line @typescript-eslint/ban-types
		withMessageScope: (message: Message, fn: Function) => {
			Sentry.withScope(async (scope) => {
				const { tag, id } = message.author
				scope.setUser({ username: tag, id })
				if (message.guild) {
					scope.setContext('Guild Information', {
						'Guild ID': message.guild.id,
						'Guild Name': message.guild.name,
					})
					scope.setContext('Channel', {
						'Channel ID': message.channel.id,
						//@ts-expect-error
						'Channel Name': message.channel.name,
					})
				} else {
					scope.setExtra('Channel Type', 'DM')
				}
				scope.setContext('Message Information', {
					'Message Content': message.content,
					'Message ID': message.id,
				})
				try {
					await fn()
				} catch (error) {
					Sentry.captureException(error)
				}
			})
		},
		// eslint-disable-next-line @typescript-eslint/ban-types
		withInteractionScope: (interaction: Interaction, fn: Function) => {
			Sentry.withScope((scope) => {
				const { tag, id } = interaction.user
				scope.setUser({ username: tag, id: id })
				if (interaction.guild) {
					scope.setContext('Guild Information', {
						'Guild ID': interaction.guild.id,
						'Guild Name': interaction.guild.name,
					})
					scope.setContext('Channel', {
						'Channel ID': interaction.channel?.id,
						//@ts-expect-error
						'Channel Name': interaction.channel.name,
					})
				} else {
					scope.setExtra('Channel Type', 'DM')
				}
				if (interaction.isCommand()) {
					scope.setContext('Slash Command Information', {
						Name: interaction.commandName,
						Options: interaction.options.data.toString(),
					})
				} else if (interaction.isButton()) {
					scope.setContext('Button Information', {
						'Custom ID': interaction.customId,
					})
				} else if (interaction.isSelectMenu()) {
					scope.setContext('Select Menu Information', {
						'Custom ID': interaction.customId,
						'Value Selected': interaction.values[0],
					})
				}
				scope.setExtra('Interaction ID', interaction.id)
				try {
					fn()
				} catch (error) {
					Sentry.captureException(error)
				}
			})
		},
	}
})()
