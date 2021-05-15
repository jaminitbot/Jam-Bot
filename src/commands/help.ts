module.exports = {
    name: 'help',
    description: 'Displays information on a specifc command',
    usage: 'help command',
    execute(client, message, args, db, logger) {
        let embed = {
            title: 'Help',
            description: `You can view a list of commands [here](https://jambot.jaminit.co.uk/docs/)`,
        }
        let messageContent
        if (args[0]) {
            // User wants info on a particular command
            const commandToFind = String(args[0]).toLowerCase()
            if (commandToFind && !(commandToFind == ' ')) {
                let prefix = db.get(message.guild.id, 'prefix')
                if (!prefix) prefix = process.env.DEFAULTPREFIX
                if (client.commands.has(commandToFind)) {
                    const command = client.commands.get(commandToFind)
                    const description = command.description || 'None'
                    const usage = command.usage || prefix + commandToFind
                    const permissionsNeeded =
                        command.permissions.tostring() || 'None'
                    embed = {
                        title: prefix + commandToFind,
                        description: `${description}\nUsage: \`${prefix}${usage}\`\nPermissions needed to use: \`${permissionsNeeded}\``,
                    }
                } else {
                    messageContent = 'Specifed command not found'
                }
            }
        }
        embed.color = '0eacc4'
        embed.footer = {
            text: `Intiated by ${message.author.tag}`,
            icon_url: message.author.displayAvatarURL(),
        }
        embed.timestamp = Date.now()
        message.channel.send({ content: messageContent || '', embed: embed })
    },
}
