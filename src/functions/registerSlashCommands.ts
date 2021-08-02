import {client} from '../customDefinitions'
export default async function register(client:client) {
    const commands = client.commands
    let data = []
    commands.forEach(command => {
        data[data.length] = {
            name: command.name,
            description: command.description,
        }
        if (command.slashCommandOptions) data[data.length - 1]['options'] = command.slashCommandOptions

    })
    await client.guilds.cache.get('771310968982339594')?.commands.set(data);
}