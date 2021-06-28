import {Message} from "discord.js"
import {client} from '../customDefinitions'
import {Logger} from "winston"

export const name = 'move'
export const description = 'Moves users from one vc to another'
export const permissions = ['MOVE_MEMBERS']
export const usage = 'move #fromvc #tovc'
export async function execute(client: client, message: Message, args, logger: Logger) {
const channels = message.mentions.channels.array()
    if (!channels || !channels[0] || !channels[1]) return message.channel.send('You need to specify two channels!')
    const fromChannel = await channels[0]
    const toChannel = await channels[1]
    // @ts-expect-error
    if (fromChannel.type != 'voice' || toChannel.type != 'voice') return message.channel.send('Both channels need to be a voice channel')
    if (fromChannel.guild.id != message.guild.id || toChannel.guild.id != message.guild.id) return message.channel.send('Hey! You can\'t move people from a VC not in this guild!')
    fromChannel.members.each(member => {
        member.voice.setChannel(toChannel, `Bulk moved members from ${fromChannel.name} to ${toChannel.name}. Intiated by ${message.author.tag}`)
    })
    message.channel.send('Poof, successfully moved people!')
}
