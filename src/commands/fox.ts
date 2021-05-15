import fetch from 'node-fetch'
module.exports = {
    name: 'fox',
    description: 'Fox',
    usage: 'fox',
    async execute(client, message, args, db, logger) {
        const { image } = await fetch(
            'https://randomfox.ca/floof/'
        ).then((response) => response.json())
        message.channel.send(
            image || "Unable to get a cute fox, the api's probably down :c"
        )
    },
}
