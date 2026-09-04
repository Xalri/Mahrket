# Discord Bot

A Discord bot built with Node.js, discord.js, MongoDB, and OpenAI.

## Requirements

- Node.js 18 or newer
- A Discord application and bot token
- A MongoDB connection string
- An OpenAI API key for AI features

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the environment file:

   ```bash
   cp .env.example .env
   ```

   On PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Fill in `.env` with your real values. Never commit `.env` or share its contents.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DISCORD_TOKEN` | Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_GUILD_ID` | Development guild ID |
| `BOT_IS_SETUP` | Whether the bot setup is complete (`true` or `false`) |
| `MONGODB_URI` | MongoDB connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `UNSPLASH_API_KEY` | Unsplash image search API key |
| `SERPAPI_API_KEY` | SerpApi web search API key |
| `SPOTIFY_CLIENT_ID` | Spotify client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify client secret |
| `YOUTUBE_API_KEY` | YouTube Data API key |
| `GIPHY_API_KEY` | Giphy API key |
| `TENOR_API_KEY` | Tenor API key for emoji mixing |
| `BOT_INFO_URL` | Optional private endpoint for bot statistics |
| `BOT_INFO_SOURCE_URL` | Local endpoint used by `update.sh` |

## Run

Start the bot with:

```bash
node main.js
```

Deploy slash commands with:

```bash
node -e "require('./deploy_commands')()"
```