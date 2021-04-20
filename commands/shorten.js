const fetch = require('node-fetch')
module.exports = {
    name: 'shorten',
    description: 'Shortens a URL',
    usage: 'shorten https://google.com',
    async execute(client, message, args, db, logger) {
        if (!args[0])
            return message.reply('you need to specify a url to shorten!')
        const data = await fetch(
            'https://is.gd/create.php?format=json&url=' +
                encodeURIComponent(args[0])
        ).then((response) => response.json())
        message.channel.send(
            '<' +
                (data.shorturl ||
                    data.errormessage ||
                    'Error getting short url.') +
                '>'
        )
    },
}
