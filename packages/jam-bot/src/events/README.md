# EVENTS

- `guildCreate.ts` - Contains typescript code for the `GUILD_CREATE` gateway event, which is fired when the bot joins a
  guild, this function sends the guild information in an embed to a text channel in the developers private server
- `guildDelete.ts` - Contains typescript code for the `GUILD_DELETE` gateway event, which is fired when the bot leaves (
  or is removed from) a guild, this function sends guild information to a text channel in the developers private server
- `guildMemberAdd.ts` - Contains typescript code for the `GUILD_MEMBER_ADD` gateway event, which is fired when a new
  user joins the guild, this function adds a role to the specified user on joining, provided the user is not awaiting
  verification or membership screening
- `guildMemberUpdate.ts` - Contains typescript code for the `GUILD_MEMBER_UPDATE` gateway event, which is fired when a
  user is updated, currently this function is simply used to check when a member passes the membership screening gate,
  and adds the role
- `interactionCreate.ts` - Contains typescript code for the `INTERACTION_CREATE` gateway event, which is fired when a
  bot's interaction is used by a user, this function determines what type of interaction has been used, and passes then
  handles it accordingly.
  - In the presence of a slash command, the function will check if the initiating user holds the correct permissions
    to run the command, and whether they can run it in the specified channel. If the checks pass the interaction will
    then be passed to a function in the corresponding command file
  - In the presence of a button, the interaction is simply passed to the correct command file to be handled
- `messageCreate.ts` - Contains typescript code for the `MESSAGE_CREATE` gateway event, which is fired upon a new
  message in any text channel the bot can see, this function is used to check if the initiating user holds the correct
  permissions to run the command, if the initiating user can run the command in the specified channel and also puts the
  command arguments into an array. If all checks are passed, the message and other arguments are passed to a function in
  the corresponding command file
- `messageDelete.ts` - Contains typescript code for the `MESSAGE_DELETE` gateway event, which is fired everytime a
  message is deleted, this function passes the message to the snipe command, and also sends the message contents, in an
  embed, to the guild's modlog channel (if logging deletes is enabled in the corresponding guild)
- `messageUpdate.ts` - Contains typescript code for the `MESSAGE_UPDATE` gateway event, which is fired everytime a
  message is edited, this function passes the new and old message to the snipe command, and also sends both of the
  messages contents contents, in an embed, to the guild's modlog channel (if logging edits is enabled in the
  corresponding guild)
