module.exports = {
	name: 'test',
	description: 'Purges messages',
	usage: '',
	execute(client, message, args, db) {
		const member = message.mentions.members.first();
        let testRole = message.guild.roles.cache.find(role => role.id == "779068004256317520")
        member.roles.add(testRole)
	},
}