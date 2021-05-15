const random = require('random')
import fetch from 'node-fetch'
const { MessageAttachment } = require('discord.js')
export {}
module.exports = {
    name: 'stockvideo',
    description: 'Gets a stock video',
    usage: 'stock nature',
    async execute(client, message, args, db, logger) {
        if (!process.env.pexelsApiKey) return
        if (!args[0])
            return message.reply('You need to specify what to search for!')
        const sent = await message.channel.send(':mag_right: Finding video...')
        const search = args.join(' ')
        const response = await fetch(
            `https://api.pexels.com/videos/search?query=${search}&per_page=80`,
            {
                headers: {
                    Authorization: process.env.pexelsApiKey,
                },
            }
        )
        const json = await response.json()
        // @ts-expect-error
        const video = json.videos[random.int((min = 0), (max = json.videos.length - 1))].video_files[0].link // eslint-disable-line no-undef
        sent.edit(
            video || "Unable to get a stock video, the api's probably down"
        )
    },
}
