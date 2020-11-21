// Mr imports
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json')
const sqlite3 = require('sqlite3').verbose();

// Registers all the commands in the commands folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Events
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')
const message = require('./events/message')

let db = new sqlite3.cached.Database('database.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
client.on('ready', () => {
   console.log('Logged in');
});
client.on("guildCreate", guild => {guildCreate.register(guild, db)})
client.on("guildDelete", guild  => { guildDelete.register(guild, db)})
client.on("message", msg => { message.register(client, msg, db) })

if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  //graceful shutdown
  db.close()
  console.log('Quiting...')
  client.destroy()
  process.exit();
});

client.login(config.token);