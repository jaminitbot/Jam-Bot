module.exports = {
  execute(client, message, args, db) {
    let prefix = args[1];
    if (!prefix) return message.channel.send('You need to specify a prefix!');
    db.run(
      'UPDATE "' +
        message.guild.id +
        "\" SET 'value' = '" +
        prefix +
        "' WHERE key='prefix'",
      (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    );
    message.channel.send("Updated prefix to '" + prefix + "'");
  },
};
