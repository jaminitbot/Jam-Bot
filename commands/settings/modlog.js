const modLogChannel = require('./modLog/modLogChannel')
const logDeletes = require('./modLog/logDeletes')
module.exports = {
	execute(client, message, args, db,) {
		const embed = {
			'title': 'Settings: Mod Log',
			'description': 'modlogchannel: Allows you to set the channel for modlogs\nlogEverything (on/off): Logs everything\nlogDeletes (on/off): Whether to log message deletes'
		}
		const subSetting = args[1]
		if (!subSetting){
			message.channel.send({embed: embed})
			return
		}
		switch(String(subSetting).toLowerCase()){
		case 'modlogchannel':
			modLogChannel.execute(client, message, args, db)
			return
		case 'logdeletes':
			logDeletes.execute(client, message, args, db)
			return
		default:
			message.channel.send({embed: embed})
		}
	}
}