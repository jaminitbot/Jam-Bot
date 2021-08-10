<<<<<<< HEAD
/* eslint-disable prefer-const */
=======
>>>>>>> 5579c79b7c8c98e25e9fec84993a7d45f452c160
import { client } from '../customDefinitions'
/**
 * Registers slash commands with discord
 * @param client Discord client
 */
export default async function register(client: client) {
	client.logger.verbose('Registering slash commands...')
	const commands = client.commands
	let data = []
	let devData = []
	commands.forEach(command => {
		if (command.permissions && command.permissions.includes('OWNER')) {
			devData[devData.length] = {
				name: command.name,
				description: command.description,
			}
			if (command.slashCommandOptions) devData[devData.length - 1]['options'] = command.slashCommandOptions
		} else {
			data[data.length] = {
				name: command.name,
				description: command.description,
			}
			if (command.slashCommandOptions) data[data.length - 1]['options'] = command.slashCommandOptions
		}
	})
	await client.application?.commands.set(data)
	if (process.env.devServerId) await client.guilds.cache.get(process.env.devServerId)?.commands.set(devData)
}