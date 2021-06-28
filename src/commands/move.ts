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
    // @ts-expect-error
    if (channels[0].type != 'voice' || channels[1].type != 'voice') return message.channel.send('Both channels need to be a voice channel')
    if (channels[0].guild.id != message.guild.id || channels[1].guild.id != message.guild.id) return message.channel.send('Hey! You can\'t move people from a VC not in this guild!')
    const fromChannel = await channels[0]
    const toChannel = await channels[1]
    fromChannel.members.each(member => {
        member.voice.setChannel(toChannel, 'Bulk moving members')
    })
    message.channel.send('Poof, successfully moved people!')
}
