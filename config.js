require("dotenv").config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    isSetup: process.env.BOT_IS_SETUP === "true",
    mongodb: process.env.MONGODB_URI,
    openaiApiKey: process.env.OPENAI_API_KEY,
    unsplashApiKey: process.env.UNSPLASH_API_KEY,
    serpApiKey: process.env.SERPAPI_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    giphyApiKey: process.env.GIPHY_API_KEY,
    tenorApiKey: process.env.TENOR_API_KEY,
    botInfoUrl: process.env.BOT_INFO_URL,
    botInfoSourceUrl: process.env.BOT_INFO_SOURCE_URL || "http://localhost:3000/bot-info"
};