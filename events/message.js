
module.exports = {
    register(client, msg, db){
        if (msg.author.bot) return
        let message = String(msg.content).toLowerCase()
        let guild = msg.guild
        db.get('SELECT "value" FROM "' + guild + '" WHERE key="prefix"', (err, row) => {
            if (err){
                console.log(err)
            }
            let prefix = String(row.value)
            const args = msg.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            if (message.startsWith(prefix)){
                if (!client.commands.has(command)) return;
                try {
                    client.commands.get(command).execute(client, msg, args, db);
                } catch (error) {
                    console.error(error);
                    msg.reply('there was an error trying to execute that command!');
                }
            }
        })
        
    }
}