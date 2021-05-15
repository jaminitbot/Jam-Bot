import fetch from 'node-fetch'
export {}
module.exports = {
    name: 'pogchamp',
    description: "Gets twitch's pogchamp of the day",
    usage: 'PogChamp',
    async execute(client, message, args, db, logger) {
        const { img } = await fetch(
            'https://raw.githubusercontent.com/MattIPv4/pogchamp/master/build/data.json'
        ).then((response) => response.json())
        message.channel.send(img.medium)
    },
}
