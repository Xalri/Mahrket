const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with multiple choices.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question for the poll')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option3')
                .setDescription('Third option')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('option4')
                .setDescription('Fourth option')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('option5')
                .setDescription('Fifth option')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
            interaction.options.getString('option5')
        ].filter(Boolean); // Remove undefined options

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

        let description = '';
        options.forEach((option, index) => {
            description += `${emojis[index]} ${option}\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Poll')
            .setDescription(question)
            .addFields({ name: 'Options', value: description })
            .setTimestamp();

        const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    },

    info: {channel: "all"}
};
