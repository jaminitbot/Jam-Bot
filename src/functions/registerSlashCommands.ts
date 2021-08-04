import {client} from '../customDefinitions'
export default async function register(client:client) {
    client.logger.verbose('Registering slash commands...')
    const commands = client.commands
    let data = []
    let devData = []
    commands.forEach(command => {
        if (!command.exposeSlash) {
            data[data.length] = {
                name: command.name,
                description: command.description,
            }
            if (command.slashCommandOptions) data[data.length - 1]['options'] = command.slashCommandOptions
        } else {
            devData[devData.length] = {
                name: command.name,
                description: command.description,
            }
            if (command.slashCommandOptions) devData[devData.length - 1]['options'] = command.slashCommandOptions
        }
    })
    await client.application?.commands.set(data)
    if (process.env.devServerId) await client.guilds.cache.get(process.env.devServerId)?.commands.set(devData)
}