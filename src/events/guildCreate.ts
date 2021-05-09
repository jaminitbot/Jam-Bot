module.exports = {
    generateGuildInfoEmbed(guild) {
        return {
            title: 'Joined guild',
            description: `Guild Name: ${guild.name}
			Guild Id: ${guild.id}
			Created At: ${guild.createdAt}
			Description: ${guild.description}
			Owner: ${guild.owner.user.tag}, ${guild.owner.id}
			Members: ${guild.memberCount}
			Partnered: ${guild.partnered}
			Verified: ${guild.verified}`,
            color: '#20BE9D',
            timestamp: Date.now(),
        }
    },
    register(guild, db, logger) {
        guild.client.channels.cache
            .get(process.env.GuildLogChannel)
            .send({ embed: this.generateGuildInfoEmbed(guild) })
    },
}
