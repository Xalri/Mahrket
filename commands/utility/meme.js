const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            
            const memeEmbed = new EmbedBuilder()
                .setTitle(meme.title)
                .setImage(meme.url)
                .setFooter({ text: `From: ${meme.subreddit}` })
                .setTimestamp()
                .setColor(`${randomColor}`);
            
            interaction.reply({ embeds: [memeEmbed] });
        } catch (error) {
            console.log(error)
            interaction.reply('Could not fetch a meme. Please try again.');
        }
    },
    info: {channel: "media"}
};
