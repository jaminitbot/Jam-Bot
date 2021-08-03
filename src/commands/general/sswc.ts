import {CommandInteraction, Message} from "discord.js"
import { client } from '../../customDefinitions'

export const name = 'sswc'
export const description = 'Shushhhhh'
export const usage = 'sswc'
export const aliases = ['supersecretwafflecommand']
import { randomInt } from '../../functions/util'
const rickRollCodes = [
	'dQw4w9WgXcQ',
	'iik25wqIuFo',
	'Lrj2Hq7xqQ8',
	'HPk-VhRjNI8',
	'Uj1ykZWtPYI',
	'EE-xtCF3T94',
	'V-_O7nl0Ii0',
	'vkbQmH5MPME',
	'8O_ifyIIrN4',
	'ikFZLI4HLpQ',
	'0SoNH07Slj0',
	'xfr64zoBTAQ',
	'cqF6M25kqq4',
	'j5a0jTc9S10',
	'dPmZqsQNzGA',
	'ID_L0aGI9bg',
	'REWyCy_m39Q',
	'nHRbZW097Uk',
	'kKi-AKvWHGM',
	'm6OCJxOsiyw',
	'z6wNtevjVOk',
	'igaCvre6WmE',
	'2EkXa0GMH1w',
	'3-csLHSLS-k',
	'6hlTj-cK7XU',
	'JrdGAcZ8vhs',
	'bIXm-Q-Xa4s',
	'aqOoTQ-G-r4',
	'fOGEMwgqN20',
	'C4rtrJjXkng',
	'nDNYN4-OYZM',
	'gMA1FUpuELo',
	'GheaIsTd7pY',
	'gN1wZiwvjX4',
	'DvqOdOY2a4I',
	'oml5cFYAlK8',
	'UtPZcwPnvkw',
	'i1EU-_Qe_28',
	'5qsptIjlHqM',
	'D2s0pNDeuuI',
	'0q2uTC0UDmQ',
	'QTT5iHCHSn0',
	'soceYqv9Dtw',
	'lypGLHSpWa0'
]
export async function execute(client: client, message: Message, args) {
	message.channel.send(`<https://youtu.be/${rickRollCodes[randomInt(0, rickRollCodes.length - 1)]}>`)
}
export async function executeSlash(client, interaction:CommandInteraction) {
	interaction.reply(`<https://youtu.be/${rickRollCodes[randomInt(0, rickRollCodes.length - 1)]}>`)
}