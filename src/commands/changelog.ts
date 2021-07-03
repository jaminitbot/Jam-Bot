import {Message, MessageEmbed} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"
import fetch from 'node-fetch'
export const name = 'changelog'
export const description = 'Displays the latest changes to the bot'
export const usage = 'changelog'
export async function execute(client: client, message: Message, args, logger: Logger) {
    const sentMessage = await message.channel.send('Loading changelog...')
    const embed = new MessageEmbed()
    embed.setTitle('Changelog')
    let log
    try {
        log = await fetch('https://raw.githubusercontent.com/jamesatjaminit/Jam-Bot/main/changelog.json').then((response) => response.json())
    } catch(e) {
        embed.setDescription('There was an error downloading the changelog, sorry about that :(')
        return sentMessage.edit({content: null, embed: embed})
    }
    if (!args[0]) {
        embed.addField(log[log.length -1].title, log[log.length -1].description)
    } else {
        if (log[args[0]-1]) {
            embed.addField(log[args[0]-1].title, log[args[0]-1].description)
        } else {
            embed.setDescription('There wasn\'t a changelog for position' + args[0])
        }
    }
    sentMessage.edit({content: null, embed: embed})
}
