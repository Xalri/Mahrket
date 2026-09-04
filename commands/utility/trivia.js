const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Get a random trivia question!'),

    async execute(interaction) {
        try {
            const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
            const trivia = response.data.results[0];

            const question = trivia.question;
            const correctAnswer = trivia.correct_answer;
            const answers = [...trivia.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Trivia Time!')
                .setDescription(question)
                .addFields(answers.map((answer, index) => ({ name: `Option ${index + 1}`, value: answer })))
                .setFooter({ text: 'Type the number of the correct answer.' });

            await interaction.reply({ embeds: [embed] });

            const filter = response => {
                return !isNaN(response.content) && parseInt(response.content) > 0 && parseInt(response.content) <= answers.length && response.author.id === interaction.user.id;
            };

            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
            const userAnswer = collected.first().content;

            if (answers[parseInt(userAnswer) - 1] === correctAnswer) {
                await interaction.followUp({ content: `Correct! 🎉 The answer is indeed "${correctAnswer}".`, ephemeral: true });
            } else {
                await interaction.followUp({ content: `Wrong! 😢 The correct answer was "${correctAnswer}".`, ephemeral: true });
            }
        } catch (error) {
            console.error('Error fetching trivia question:', error);
            await interaction.reply({ content: 'Sorry, I could not fetch a trivia question at this time. Please try again later.', ephemeral: true });
        }
    },
};
