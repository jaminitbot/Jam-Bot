module.exports = {
  execute(client, message, args, db) {
    const toggle = String(args[2]).toLowerCase();
    if (!toggle || !toggle == 'on' || !toggle == 'off') {
      return message.channel.send(
        "You need to specify whether you want to toggle logging deletes 'on' or 'off'"
      );
    }
    db.run(
      'UPDATE "' +
        message.guild.id +
        "\" SET 'value' = '" +
        toggle +
        "' WHERE key='logDeletedMessages'",
      (err) => {
        if (err) return console.error(err.message);
        message.channel.send(`Turned logging deletes ${toggle}`);
      }
    );
  },
};
