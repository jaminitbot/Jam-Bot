import fetch from 'node-fetch'
export {}
module.exports = {
    name: 'hug',
    description: 'HUGGSS',
    usage: 'hug',
    async execute(client, message, args, db, logger) {
        const { link } = await fetch(
            'https://some-random-api.ml/animu/hug'
        ).then((response) => response.json())
        message.channel.send(link)
    },
}
