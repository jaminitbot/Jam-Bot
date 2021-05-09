module.exports = {
    name: 'logdeletes',
    description: 'Turns logging deletes on or off',
    usage: 'settings modlog logdeletes on|off',
    async execute(client, message, args, db, logger) {
        const toggle = String(args[2]).toLowerCase()
        if (!toggle || !toggle == 'on' || !toggle == 'off') {
            return message.channel.send(
                "You need to specify whether you want to toggle logging deletes 'on' or 'off'\n" +
                    this.usage
            )
        }
        if (toggle == 'on') {
            db.updateKey(message.guild, 'logDeletedMessages', true)
        } else {
            db.updateKey(message.guild, 'logDeletedMessages', false)
        }
        message.channel.send(`Turned logging deletes ${toggle}`)
    },
}
