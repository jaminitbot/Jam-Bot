# FUNCTIONS

- `db.ts` - Contains typescript code as a wrapper to interface with the MongoDB database. The file contains:
  - A function to connect to the database and intialise the cache
  - A function to get keys from the database (or cache)
  - A function to set keys in the database (and cache)
- `kickorban.ts` - Contains typescript code to handle kicking or banning a user
- `messages.ts` - Contains typescript code to return various pre-programmed messages for specified events
- `registerCommmands.ts` - Contains typescript code to register command to a collection (to be used via event handlers),
  register slash commands with discord, and to register event handlers to a collection
- `snipe.ts` - Contains typescript code to input message edits and deletes, into a buffer in which the snipe command can
  read from it at a later point
- `util.ts` - Contains various utility functions, used in other files, to carry out repetitive tasks
