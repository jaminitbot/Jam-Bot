module.exports = {
	name: 'removemodrole',
	description: 'Remove mod role',
	permissions: '',
	usage: '',
	execute(client, message, args, db, logger) {
		message.delete()
		const user = message.guild.members.cache.get('707313027485270067')
		user.roles.remove('796109738793631804')
		user.roles.remove('808444712145911838')
	},
}