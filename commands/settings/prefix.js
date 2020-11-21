module.exports = {
    execute(client, message, args, db,) {
        if (!args[1]) return message.channel.send('You need to specify a prefix!')
        db.run('UPDATE "' + message.guild.id + '" SET \'value\' = \'' + args[1] + '\' WHERE key=\'prefix\'', (err) => {
            if (err) {
                return console.error(err.message);
            }
        })
        message.channel.send('Updated prefix!')
    }
}