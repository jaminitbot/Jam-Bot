module.exports = {
    register(guild, db) {
        guild.client.channels.cache
            .get(process.env.GuildLogChannel)
            .send(`Oh dear, we left ${guild.name}, ${guild.id}`)
    },
}
