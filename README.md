# Jam-Bot

A discord bot designed to be easy to setup, but full of features.

## Installation:

### Docker

1. Make the `docker-compose.yaml` file: 
```yaml
services:
    bot:
        image: 'jamesatjaminit/jam-bot:latest'
        env_file:
            - .env
        restart: unless-stopped
```
2. Copy the env file from `.env.example` `.env` and fill out
3. Run the bot: `docker-compose up -d`

### Manual
1. Clone the repo `git clone https://github.com/jamesatjaminit/Jam-Bot`
2. Install deps `pnpm install`
3. Copy the env file from `.env.example` to `.env` and fill out
4. Compile typescript: `pnpm build`
5. Run the bot: `pnpm start`

## TODO:

-   More modlogs
-   Better settings/web dashboard
