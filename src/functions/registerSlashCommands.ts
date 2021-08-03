import {client} from '../customDefinitions'
export default async function register(client:client) {
    client.logger.verbose('Registering slash commands...')
    const commands = client.commands
    let data = []
    commands.forEach(command => {
        if (!command.exposeSlash) {
            data[data.length] = {
                name: command.name,
                description: command.description,
            }
            if (command.slashCommandOptions) data[data.length - 1]['options'] = command.slashCommandOptions
        }
    })
    await client.application?.commands.set(data);
}