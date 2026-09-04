const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Hangman } = require('discord-gamecord')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Start a game of Hangman'),

    async execute(interaction) {
        const game = new Hangman({
            message: interaction,
            embed: {
                title: 'Hangman',
                color: '#5B65F2'
            },
            hangman: {hat: "🎩", head: "👒", shirt: "😬", pants: "👗", boots: "👠"},
            timeout: 60000,
            timeWords: "all",
            winMessage: "You won. The word was **{word}**",
            loseMessage: "You lose. The word was **{word}**",
            playerOnlyMessage: "Only {player} can use these buttons",
        })

        game.startGame()
        game.on('gameOver', (result) => {
            return
        })
    },
};
