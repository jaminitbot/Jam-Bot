import { getInvalidPermissionsMessage } from '../functions/messages'
module.exports = {
	name: 'eval',
	description: 'Executes code',
	usage: 'eval 1+1',
	async execute(client, message, args, db, logger) {
		if (message.author.id == process.env.OWNERID) {
			message.channel.send(String(await eval(args.splice(0).join(' '))))
		} else {
			message.channel.send(getInvalidPermissionsMessage())
		}
	},
}
