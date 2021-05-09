module.exports = {
    name: 'debug',
    description: 'Displays debug information',
    permissions: ['ADMINISTRATOR'],
    usage: 'debug',
    async execute(client, message, args, db, logger) {
        const sent = await message.channel.send('Loading...')
        let TimeDate = new Date(Date.now() - client.uptime)
        let embed = {
            title: 'Debug Information',
            description: `Roundtrip: \`${
                sent.createdTimestamp - message.createdTimestamp
            }ms\`\nAPI: \`${client.ws.ping}ms\`\nRevision: \`${
                process.env.GIT_REV || 'N/A'
            }\`\nUp since: \`${TimeDate.toString()}\``,
            footer: {
                text: `Intiated by ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL(),
            },
            timestamp: Date.now(),
        }
        sent.edit({ content: '', embed: embed })
    },
}
