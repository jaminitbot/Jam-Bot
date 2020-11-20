// Mr imports
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
const sqlite3 = require('sqlite3').verbose();

// Events
const guildCreate = require('./events/guildCreate')
const guildDelete = require('./events/guildDelete')

let db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
client.on('ready', () => {
   console.log('Logged in');
});
client.on("guildCreate", guild => {guildCreate.register(guild, db)})
client.on("guildDelete", guild => { guildDelete.register(guild, db)})

client.login(config.token);