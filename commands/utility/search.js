const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getJson } = require('serpapi');
const axios = require('axios');
const config = require('../../config');

const SEARCH_COLOR = '#0099ff';
const REQUEST_TIMEOUT = 10000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search images, the web, songs, videos, or GIFs')
        .addSubcommand(createQuerySubcommand('image', 'Search for an image'))
        .addSubcommand(createQuerySubcommand('web', 'Search the web'))
        .addSubcommand(createQuerySubcommand('song', 'Search for a song'))
        .addSubcommand(createQuerySubcommand('video', 'Search for a video'))
        .addSubcommand(createQuerySubcommand('gif', 'Search for a GIF')),
    async execute(interaction) {
        await interaction.deferReply();

        const type = interaction.options.getSubcommand();
        const query = interaction.options.getString('query', true).trim();

        try {
            const result = await searchers[type](query);
            if (!result) {
                await interaction.editReply({ content: `No ${type} results found for: ${query}` });
                return;
            }

            await interaction.editReply({ embeds: [buildEmbed(type, query, result, interaction)] });
        } catch (error) {
            console.error(`Search error (${type}):`, error);
            await interaction.editReply({ content: `The ${type} search is currently unavailable.` });
        }
    }
};

function createQuerySubcommand(name, description) {
    return (subcommand) => subcommand
        .setName(name)
        .setDescription(description)
        .addStringOption((option) => option
            .setName('query')
            .setDescription('The search query')
            .setRequired(true));
}

const searchers = {
    image: searchImage,
    web: searchWeb,
    song: searchSong,
    video: searchVideo,
    gif: searchGif
};

function buildEmbed(type, query, result, interaction) {
    const embed = new EmbedBuilder()
        .setColor(SEARCH_COLOR)
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

    if (type === 'image' || type === 'gif') {
        return embed
            .setTitle(`${capitalize(type)} search result for: ${query}`)
            .setImage(result);
    }

    if (type === 'web') {
        return embed
            .setTitle(`Web search results for: ${query}`)
            .setDescription(result.map((item) => `[${item.title}](${item.url})`).join('\n'));
    }

    if (type === 'song') {
        return embed
            .setTitle(result.title)
            .setURL(result.url)
            .setDescription(`By [${result.artist}](${result.artistUrl})`)
            .addFields({ name: 'Listen', value: `[Open in Spotify](${result.url})` });
    }

    return embed
        .setTitle(result.title)
        .setURL(result.url)
        .setImage(result.thumbnail)
        .setDescription(`[Watch on YouTube](${result.url})`);
}

async function searchImage(query) {
    requireKey(config.unsplashApiKey, 'UNSPLASH_API_KEY');
    const data = await fetchJson(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${encodeURIComponent(config.unsplashApiKey)}`);
    return data.results?.[0]?.urls?.regular || null;
}

async function searchWeb(query) {
    requireKey(config.serpApiKey, 'SERPAPI_API_KEY');
    const response = await new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) reject(new Error('SerpApi request timed out'));
        }, REQUEST_TIMEOUT);
        getJson({
            engine: 'duckduckgo',
            q: query,
            kl: 'fr-fr',
            api_key: config.serpApiKey
        }, (data) => {
            settled = true;
            clearTimeout(timer);
            resolve(data);
        });
    });

    if (response.search_metadata?.status !== 'Success') {
        throw new Error('SerpApi search failed');
    }

    return (response.organic_results || [])
        .slice(0, 5)
        .filter((item) => item.title && item.link)
        .map((item) => ({ title: item.title, url: item.link }));
}

async function searchSong(query) {
    requireKey(config.spotifyClientId, 'SPOTIFY_CLIENT_ID');
    requireKey(config.spotifyClientSecret, 'SPOTIFY_CLIENT_SECRET');

    const authResponse = await fetchJson('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await fetchJson(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: { Authorization: `Bearer ${authResponse.access_token}` }
    });
    const track = data.tracks?.items?.[0];
    if (!track) return null;

    const artist = track.artists?.[0];
    return {
        title: track.name,
        url: track.external_urls?.spotify,
        artist: artist?.name || 'Unknown artist',
        artistUrl: artist?.external_urls?.spotify || track.external_urls?.spotify
    };
}

async function searchVideo(query) {
    requireKey(config.youtubeApiKey, 'YOUTUBE_API_KEY');
    const data = await fetchJson(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${encodeURIComponent(config.youtubeApiKey)}`);
    const item = data.items?.[0];
    if (!item?.id?.videoId || !item.snippet) return null;

    return {
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
    };
}

async function searchGif(query) {
    requireKey(config.giphyApiKey, 'GIPHY_API_KEY');
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: { api_key: config.giphyApiKey, q: query, limit: 1 },
        timeout: REQUEST_TIMEOUT
    });
    return response.data.data?.[0]?.images?.original?.url || null;
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT)
    });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

function requireKey(value, name) {
    if (!value) throw new Error(`${name} is not configured`);
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
